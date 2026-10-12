/* This is a script to build the site with Pagefind */

const { execSync } = require('child_process');
const { existsSync, readdirSync, readFileSync, rmSync } = require('fs');
const { join } = require('path');

// Recursively collect every file below `dir` (returns [] when it does not exist)
function listFiles(dir, out = []) {
    if (!existsSync(dir)) return out;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) listFiles(full, out);
        else out.push(full);
    }
    return out;
}

// Post sources are matched by the same rule as the `posts` content collection
// in src/content.config.ts: markdown below src/content/posts, ignoring entries
// whose file or folder name starts with "_".
function isPostSource(relativePath) {
    const parts = relativePath.split('/');
    return (
        /\.(md|mdx)$/i.test(relativePath) &&
        !parts.some((part) => part.startsWith('_'))
    );
}

// A post is rendered in production builds only when its front matter does not
// set `draft: true`.
function isDraftSource(absolutePath) {
    const content = readFileSync(absolutePath, 'utf8').replace(/^\uFEFF/, '');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontMatter = match ? match[1] : content;
    return /^[ \t]*draft[ \t]*:[ \t]*true[ \t]*$/im.test(frontMatter);
}

// Guard against publishing pages for posts that no longer exist in the source
// tree. This is what made a build keep serving already-deleted articles: the
// deployed artifact no longer matched the sources, yet nothing failed.
// `data-pagefind-body` is only rendered for post pages, one page per post.
function listSourcePosts() {
    const postsSourceDir = join(process.cwd(), 'src', 'content', 'posts');
    return listFiles(postsSourceDir)
        .map((file) => ({
            absolute: file,
            relative: file.slice(postsSourceDir.length + 1).split('\\').join('/'),
        }))
        .filter((entry) => isPostSource(entry.relative))
        .filter((entry) => !isDraftSource(entry.absolute))
        .map((entry) => entry.relative.replace(/\.(md|mdx)$/i, ''));
}

// `data-pagefind-body` is rendered only on post pages, so the relative path
// "posts/<slug>/index.html" identifies exactly one rendered post.
function listBuiltPostPages(outputDir) {
    const absoluteOutputDir = join(process.cwd(), outputDir);
    return listFiles(absoluteOutputDir)
        .filter((file) => /\.html$/i.test(file))
        .map((file) => file.slice(absoluteOutputDir.length + 1).split('\\').join('/'))
        .filter((relative) => relative.startsWith('posts/'))
        .filter((relative) =>
            readFileSync(join(absoluteOutputDir, relative), 'utf8').includes('data-pagefind-body'),
        )
        .map((relative) => relative.replace(/^posts\//, '').replace(/\/index\.html$/, ''));
}

function reportIntegrity(outputDir) {
    const sourcePosts = listSourcePosts();
    const builtPosts = listBuiltPostPages(outputDir);

    console.log('🔎 Verifying build output against the post sources...');
    console.log(`📄 Posts in src/content/posts (published): ${sourcePosts.length}`);
    console.log(`📄 Post pages in ${outputDir}: ${builtPosts.length}`);

    // Every rendered post page must still have a matching source file.
    const orphans = builtPosts.filter(
        (slug) => !sourcePosts.some((source) => source.toLowerCase() === slug.toLowerCase()),
    );

    if (orphans.length > 0) {
        throw new Error(
            'Build integrity check failed: the output contains post pages without a matching ' +
                'source file, so deleted articles would be published again:\n' +
                orphans.map((slug) => `     - /posts/${slug}/`).join('\n'),
        );
    }

    const missing = sourcePosts.filter(
        (source) => !builtPosts.some((slug) => slug.toLowerCase() === source.toLowerCase()),
    );

    if (missing.length > 0) {
        console.warn('⚠️  These posts exist in the sources but were not rendered:');
        for (const slug of missing) console.warn(`     - /posts/${slug}/`);
    }

    console.log('�?Build output matches the post sources.');
}

// Detect the platform
function detectPlatform() {
    // Check environment variables
    if (process.env.GITHUB_ACTIONS) {
        return 'github';
    }
    if (process.env.CF_PAGES) {
        return 'cloudflare';
    }
    if (process.env.NETLIFY) {
        return 'netlify';
    }
    if (process.env.EDGEONE) {
        return 'edgeone';
    }
    if (process.env.VERCEL) {
        return 'vercel';
    }

    // Check if specific directories exist
    if (existsSync('.vercel')) {
        return 'vercel';
    }

    // Default to standard dist directory
    return 'default';
}

// Get Pagefind output directory
function getPagefindOutputDir(platform) {
    const outputDirs = {
        default: 'dist',
        github: 'dist',
        cloudflare: 'dist',
        netlify: 'dist',
        edgeone: 'dist',
        vercel: '.vercel/output/static',
    };

    return outputDirs[platform] || 'dist';
}

// Astro keeps the Content Layer index in node_modules/.astro/data-store.json.
// When a post file is deleted, that cached index can still describe the deleted
// post, so `astro build` keeps rendering a page for an article that no longer
// exists on disk. Dropping the cache forces a fresh scan of src/content, which
// is what makes a local `pnpm build` agree with the current sources.
function resetContentCache() {
    const cacheDir = join(process.cwd(), 'node_modules', '.astro');
    if (!existsSync(cacheDir)) return;
    console.log('🧹 Dropping the cached Astro content index (node_modules/.astro)...');
    try {
        rmSync(cacheDir, { recursive: true, force: true });
    } catch (error) {
        console.warn(`⚠️  Could not remove ${cacheDir}: ${error.message}`);
    }
}

// Main function
function main() {
    const platform = detectPlatform();
    const outputDir = getPagefindOutputDir(platform);

    console.log(`🚀 Detected deployment platform: ${platform}`);
    console.log(`📁 Pagefind output directory: ${outputDir}`);

    try {
        resetContentCache();

        // Run Astro build
        console.log('🔨 Running Astro build...');
        execSync(`npx astro build`.trim(), {
            stdio: 'inherit',
            cwd: process.cwd() // Ensure in the correct directory
        });

        // Check if output directory exists
        if (!existsSync(outputDir)) {
            console.error(`�?Output directory does not exist: ${outputDir}`);
            process.exit(1);
        }

        // Run Pagefind
        console.log(`🔍 Running Pagefind search index generation...`);
        execSync(`npx pagefind --site ${outputDir}`, {
            stdio: 'inherit',
            cwd: process.cwd() // Ensure in the correct directory
        });

        // Refuse to publish an artifact that still contains deleted articles
        reportIntegrity(outputDir);

        console.log('�?Build completed!');
        console.log(`📊 Search index generated at: ${outputDir}/pagefind/`);

    } catch (error) {
        console.error('�?Build failed:', error.message);
        process.exit(1);
    }
}

main();