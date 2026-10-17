---
title: 西邮 Linux 兴趣小组 2026 纳新一面试题题解
published: 2026-10-13    # 发布日期
description: 写题解！2026！     # 显示在列表页的摘要
cover: /assets/images/xsx.jpg    # 文章封面图（可选）
tags: [学习, C]      # 标签
category: 题解   # 分类
draft: false             # 是否为草稿
---

# 西邮 Linux 兴趣小组 2026 纳新一面试题

> 学长寄语：长期以来，西邮 Linux 兴趣小组的面试题以难度之高名扬西邮校内。我们作为出题人也清楚的知道这份试题略有难度。请你动手敲一敲代码。别担心，若有同学能完成一半的题目，就已经十分优秀。其次，相比于题目的答案，我们对你的思路和过程更感兴趣，或许你的答案略有瑕疵，但你正确的思路和对知识的理解足以为你赢得绝大多数的分数。最后，做题的过程也是学习和成长的过程，相信本试题对你更加熟悉地掌握 C 语言一定有所帮助。祝你好运。
> 

本题目只作为西邮 Linux 兴趣小组 2026 纳新面试的有限参考。

为节省版面，本试题的程序源码省去了部分 `main` 函数的 `return 0;` 和 `#include` 指令。本试题中的程序源码仅用于考察 C 语言基础，不应当作为 C 语言「代码风格」的范例。所有题目编译并运行于 x86_64 GNU/Linux 环境。

## 0. 树懒闪电的二进制车牌

树懒闪电要办一张二进制车牌：16 个按钮里有四个连续按钮的数是 21, 34, 55, 89，每个按钮最多按一次、不能按相邻的两个，按下数字之和即车牌号。屏幕显示 `11010100101`，该按哪几个按钮？其十进制是多少？

（提示：这 16 个数构成递推数列，每项等于前两项之和。）

### 题解：

答案：

按下的按钮数值为 **1597、89、13、2**，对应按钮序号（从 1 数起）**16、10、6、2**；车牌号十进制为 **1701**。

分析:

1. 题面给出四个连续按钮为 21、34、55、89，并说明每项等于前两项之和。显然为斐波那契数列。

2. 于是问题变成「在这些可能的 16 项数列里，哪些非相邻子集的和等于 1701」

|候选数列（16 项）|21/34/55/89 是否连续|非相邻子集最大和|能否凑出 1701|
|---|---|---|---|
|1, 1, 2, 3, 5, 8, …, 610, 987|是|987+377+144+55+21+8+3+1 = **1596**|不能，上界不足|
|0, 1, 1, 2, 3, 5, …, 377, 610|是|610+233+89+34+13+5+2+1 = **987**|不能|
|1, 2, 3, 5, 8, 13, …, 987, 1597|是|1597+610+233+89+34+13+5+2 = **2583**|能，唯一解|

- 对于1, 2, 3, 5, 8, 13, …, 987, 1597数列，从最大数往小选，直到组合满足题意，得到答案。

> 有关的定理：
> 对 `1, 2, 3, 5, 8, …` 这一支斐波那契数列，任意正整数都能写成若干不相邻项之和，且写法唯一，这就是 Zeckendorf 定理。该定理指出，**任何正整数均可表示成若干个不连续的斐波那契数（不包括第一个斐波那契数）之和**。


## 1. 一句印不完的欢迎词

这句欢迎词是永无止境的吗？请解释运行结果：`printf` 的返回值扮演了什么角色，`while` 是否真的停不下来？

```c
int main(){
    while (1){
        printf("Hi!");
        if (!printf("The 202%d, Welcome to Xiyou Linux Group!\n",
                    printf("guys! "))){
            break;
        }
    }
}
```

### 题解：

输出：

```
Hi!guys!The 2026, Welcome to Xiyou Linux Group!
Hi!guys!The 2026, Welcome to Xiyou Linux Group!
Hi!guys!The 2026, Welcome to Xiyou Linux Group!
···
（死循环，会一直打印）
```

分析：

- `printf`的返回值是**成功写出的字符数**，出错时返回**负值**。

- 最内层 `printf("guys! ")` 返回 6，所以它先输出 `guys!` ，然后外层 `printf` 使用返回值 6 替换 `%d`，组成 `2026`。

- **外层`printf`的输出长度是 40。**`"The 2026, Welcome to Xiyou Linux Group!\n"` 共 40 个字符，包含最后的换行符 `\n`，因此返回 40。

- **正常输出时，条件为假。**`!40` 等于 0，`if` 不成立，`break` 不执行，`while(1)` 继续循环，程序持续输出，形成死循环。

**注意：**`!printf(...)` 判断的是返回值是否为 `0`，而不是是否发生错误。`printf`出错时会返回负值，此时逻辑非的结果仍然为 `0`。

如果想判断输出是否失败，应当使用：

```c
if (printf(...) < 0) {
    break;
}
```

## 2. 失忆的交换生

两位交换生都帮 `a` 和 `b` 换座位：第一位换完就忘，第二位却成功了。请解释运行结果：函数修改外部变量的必要条件是什么？

```c
void swap_val(int x, int y){
    int tmp = x;
    x = y;
    y = tmp;
}

void swap_ptr(int *x, int *y){
    int tmp = *x;
    *x = *y;
    *y = tmp;
}

int main(){
    int a = 10, b = 20;
    swap_val(a, b);
    printf("swap_val: a=%d, b=%d\n", a, b);
    swap_ptr(&a, &b);
    printf("swap_ptr: a=%d, b=%d\n", a, b);
}
```

### 题解：

输出：

```
swap_val: a=10, b=20
swap_ptr: a=20, b=10
```

分析：

1. **C 只有一种参数传递方式，值传递。形参是实参的副本，函数体里改的是副本。**
2. `void swap_val(int x, int y)`，调用`swap_val(a, b);`，实际上x = a 的副本，y = b 的副本。
3. `void swap_ptr(int *x, int *y)`,调用`swap_ptr(&a, &b);`，传入a 的地址 和b 的地址，实现了对a，b的修改
- **函数修改外部变量需要把变量的地址传进去，然后通过指针间接修改。**

## 3. sizeof 的视力表

请预测输出，并解释每个 `sizeof` 和 `strlen` 的结果：注意字符串中间的 `\0`、数组退化与指针类型。

```c
void inspect(char text[], int (*matrix)[4]) {
    printf("%zu %zu %zu %zu\n",
           sizeof(text), sizeof(matrix),
           sizeof(*matrix), strlen(text));
}

int main() {
    char a[] = "Linux\0Group";
    char *p = a;
    int b[2][4] = {{1, 2, 3, 4}, {5, 6, 7, 8}};

    printf("%zu %zu %zu\n",
           sizeof(a), sizeof(p), sizeof(a + 0));
    printf("%d %d\n", a[5] == '\0', strcmp(a, "Linux"));
    inspect(a, b);
}
```

### 题解：

输出：

```
12 8 8
1 0 
8 8 16 5
```

分析：

1. `a` 包括中间的 `\0` 和末尾自动添加的 `\0`，所以 `sizeof(a)=12`。

2. `p` 是指针，在 x86_64 环境下占 8 字节；`a+0` 也是指针，因此 `sizeof(a+0)=8`。

3. `a[5]=='\0'` 为真，结果是 `1`；`strcmp(a,"Linux")` 在第一个 `\0` 处停止比较，确实相同，结果为 `0`。

4. 在 `inspect` 中，`text` 和 `matrix` 都是指针，占 8 字节；`*matrix` 是包含 4 个 `int` 的数组，占 16 字节；`strlen(text)=5`。

## 4. XOR 密钥：藏在字节里的悄悄话

一串数字里藏着一句悄悄话。请解释代码如何用位运算把数字还原成字符：`mask` 怎么构造，为什么异或后恰好是原文？

```c
int main(){
    int nums[] = {167,150,134,144,138,179,150,145,138,135,184,141,144,138,143};
    int size = sizeof(nums)/sizeof(nums[0]);
    for (int i = 0; i < size; i++){
        int mask = 0;
        int bitval = 1;
        int bits = 8;
        while (bits-- > 0){
            mask |= bitval;
            bitval <<= 1;
        }
        printf("%c", nums[i] ^ mask);
        if (i == size - 1){
            printf("\n");
        }
    }
}
```

### 题解：

输出：

```
XiyouLinuxGroup
```

分析：

1. 循环将二进制的低 8 位全部设为 1，最终 `mask=255`。

2. `^` 表示按位异或。同一个数异或两次，可以恢复原来的数。

3. 每个数字与 `255` 异或后，再通过 `%c` 输出为字符，得到原文。

- 所以167,150,134,144,138,179,150,145,138,135,184,141,144,138,143这一串数字是提前设计好的😋

## 5. 宏召唤术：括号去哪儿了

这两个宏看着人畜无害，展开后却各有脾气。请写出四行 `printf` 的输出，并解释原因。

```c
#define SQUARE(x) x* x
#define MAX(a, b)((a)>(b)?(a):(b))

int main(){
    int i = 3;
    printf("%d\n", SQUARE(i + 1));
    printf("%d\n", MAX(i, 5));
    printf("%d\n", MAX(i++, 5));
    printf("%d\n", i);
}
```

### 题解：

输出：

```
7
5
5
4
```

分析：

1. `SQUARE(i+1)` 展开为 `i+1*i+1`，根据运算优先级，结果是 `7`，而不是 `16`。

2. `MAX(i,5)` 比较 3 和 5，结果为 `5`。

3. `MAX(i++,5)` 中，`i++` 先使用 3，再将 `i` 加到 4，因此结果为 `5`。

4. 最后一行输出 `4`。

**宏只是文本替换，定义时应给参数和整个表达式加括号(最稳妥的写法)！**

## 6. p 与 q 的步幅之争

`p` 和 `q` 指向同一个数组，「步幅」却大不相同。输出是什么？`p + 1` 和 `q + 1` 各跨过多少字节？

```c
int main(){
    int a[4] = {1,2,3,4};
    int *p = a;
    int (*q)[4] = &a;
    printf("%td %td\n",
           (char *)(p + 1) - (char *)p,
           (char *)(q + 1) - (char *)q);
    printf("%d %d\n", *(p + 2), *(*q + 2));
}
```

### 题解：

输出：

```
4 16
3 3
```

分析：

1. `p` 是 `int *`，加 1 移动 4 字节；`q` 指向包含 4 个 `int` 的数组，加 1 移动 16 字节。

2. `*(p+2)` 和 `*(*q+2)` 都访问 `a[2]`，结果都是 3。

**指针加 1，移动的是一个所指向类型的大小。**

## 7. 记性特别好的 x

这个 `x` 走遍千山万水仍记得来时的路。请预测每行输出，并解释 `static` 局部变量在递归中的行为。

```c
int visit(int n) {
    static int x = 0;
    if (n == 0)
        return x;

    x += n;
    printf("before %d %d\n", n, x);
    int result = visit(--n);
    printf("after %d %d %d\n", n, x, result);
    return x + result;
}

int main() {
    printf("first = %d\n", visit(3));
    printf("second = %d\n", visit(2));
}
```

输出：

```
before 3 3
before 2 5
before 1 6
after 0 6 6
after 1 6 12
after 2 6 18
first = 24
before 2 8
before 1 9
after 0 9 9
after 1 9 18
second = 27
```

分析：

1. `static` 局部变量只初始化一次，递归的所有层共享同一个 `x`。

2. 第一次调用 `visit(3)`，`x` 依次变成 3、5、6，最后返回结果为 24。

3. 第二次调用时，`x` 不会重新变成 0，而是从 6 开始，最终结果为 27。

4. `visit(--n)` 会先将 `n` 减 1，再传入下一层，所以返回后打印的 `n` 已经减过了。

[怎么理解递归？](https://www.bilibili.com/video/BV1Nx411D712/?share_source=copy_web&vd_source=481ab9f18d14618554914a2987ba9c85)

## 8. 谁能动 const 大神的奶酪

一眼以为「`const` 就全不能动」，逐条判断却错一片。请判断九个操作是否合法，并说明原因。

```c
struct P { int x; const int y; };

int main(){
    struct P p1 = {11, 22}, p2 = {33, 44};
    const struct P p3 = {55, 66};
    struct P *const ptr1 = &p1;
    const struct P *ptr2 = &p2;
    const struct P *const ptr3 = &p3;
}

ptr1->x = 111;
ptr2->x = 333;
ptr3->x = 555;
ptr1->y = 222;
ptr1 = &p2;
ptr2->y = 444;
ptr2 = &p1;
ptr3->y = 666;
ptr3 = &p1;
```

### 题解：

答案：

| 操作               | 是否合法 |
| ---------------- | ---- |
| `ptr1->x = 111;` | 合法   |
| `ptr2->x = 333;` | 不合法  |
| `ptr3->x = 555;` | 不合法  |
| `ptr1->y = 222;` | 不合法  |
| `ptr1 = &p2;`    | 不合法  |
| `ptr2->y = 444;` | 不合法  |
| `ptr2 = &p1;`    | 合法   |
| `ptr3->y = 666;` | 不合法  |
| `ptr3 = &p1;`    | 不合法  |

分析：

- `ptr1`：指针不能改变指向，但可以修改结构体中非 `const` 的成员。

- `ptr2`：指针可以改变指向，但不能通过它修改结构体。

- `ptr3`：指针不能改变指向，也不能通过它修改结构体。

- `y` 本身是 `const` 成员，不能修改。

有个自用的方法：

指针那一块，`p` 是指针本身，`*p` 可以理解为指针指向的值。理解这一个之后，可以很快地分辨是指针指向不能动，还是指针指向的值不能动。

- `const int *p`：`*p` 的值不能通过 `p` 修改，但 `p` 可以改变指向。
	这是**指向常量的指针**。
- `int *const p`：`p` 的指向不能改变，但 `*p` 的值可以修改。
	这是**指针常量**。
- `const int *const p`：`p` 的指向不能改变，`*p` 的值也不能通过 `p` 修改。
	这是**指向常量的指针常量**。
## 9. 当函数变成了数字

在这里，函数既能装进数组，也能被加减乘除。这段代码写得标准吗？注意 `INT_MIN` 和 `0xFFFFFFFF`。

```c
typedef int (*BinOp)(int, int);

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

BinOp ops[3] = { add, sub, mul };

int (*get_op(char c))(int, int) {
    switch (c) {
        case '+': return add;
        case '-': return sub;
        default: return mul;
    }
}

int main() {
    printf("%d\n", get_op('*')(7, -2));
    printf("%d\n", ops[1](INT_MIN, 20));
    printf("%d\n", get_op('+')(0xFFFFFFFF, 2027));
}
```

### 题解：

输出：

```
-14
2147483628（未定义行为！不一定！）
2026
```

分析：

1. `get_op('*')(7, -2)`：`get_op('*')` 返回乘法函数 `mul`，所以结果为 $7×(−2)=−14$。

2. `ops[1](INT_MIN, 20)`：`ops[1]` 对应减法函数 `sub`，计算 `INT_MIN-20`。但这个结果超出了 `int` 的表示范围，发生**有符号整数溢出**，属于**未定义行为**，因此不能保证输出。上面的 `2147483628` 不是标准保证的结果。

3. `get_op('+')(0xFFFFFFFF, 2027)`：调用加法函数。常见环境下，`0xFFFFFFFF` 转换为 `int` 后通常为 `-1`，因此结果为 `-1+2027=2026`。不过，这种转换结果由具体实现决定。

- 什么是整数溢出？

	在c语言中，有标准库`<limits.h>`，其中有两个常用的常量：
	`INT_MIN`：`int` 类型的最小值（-2147483648）。
	`INT_MAX`：`int` 类型的最大值（2147483647）。
	当运算结果大于 `INT_MAX` 时，称为上溢；当运算结果小于 `INT_MIN` 时，称为下溢。

	在 32 位补码表示中：
	
	- 最大正数是 `2147483647` = `01111111111111111111111111111111`
	    
	- 最小负数是 `-2147483648` = `10000000000000000000000000000000`

	对于有符号整数溢出，虽然很多机器上会表现为**补码回绕**，但不能依赖这种结果！

有关函数指针和指针函数的部分可能有些绕，可以看下此视频：

[函数指针和指针函数](https://www.bilibili.com/video/BV1PeWVehE4x/)

## 10. 字节战队排排站：大端、小端与内存对齐

同一片内存，不同视角看到不同世界。请写出全部输出，并解释大端、小端与内存对齐的原理。

```c
struct data_box {
    int num;
    union {
        unsigned int u32_val;
        unsigned char bytes[4];
        char string[32];
    } un;
    short tag;
    long long magic;
    int buf[4];
};

int main(){
    int arr[] = {0x00000000, 0x6F796958, 0x694C2075,
                 0x2078756E, 0x756F7247, 0x00000070,
                 0x44556677, 0x8899aabb};
    printf("%s\n", ((struct data_box *)arr)->un.string);
    printf("byte0 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[0]);
    printf("byte1 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[1]);
    printf("byte2 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[2]);
    printf("byte3 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[3]);
}
```

### 题解：

输出：

```
Xiyou Linux Group
byte0 = 0x58
byte1 = 0x69
byte2 = 0x79
byte3 = 0x6F
```

分析：

**结构体偏移：**

| 成员      | 类型        | 大小  | 对齐要求 | 偏移  | 占用区间    |
| ------- | --------- | --- | ---- | --- | ------- |
| `num`   | int       | 4   | 4    | 0   | 0 到 3   |
| `un`    | union     | 32  | 4    | 4   | 4 到 35  |
| `tag`   | short     | 2   | 2    | 36  | 36 到 37 |
| 填充      |           | 2   |      | 38  | 38 到 39 |
| `magic` | long long | 8   | 8    | 40  | 40 到 47 |
| `buf`   | int[4]    | 16  | 4    | 48  | 48 到 63 |

union 的大小由最长成员 `char string[32]` 决定，所以是 32。`magic` 要求 8 字节对齐，`tag` 结束在 38，必须补 2 字节到 40。总大小 64 恰好是最大对齐 8 的整数倍，不需要再补。

| 数组元素   | 十六进制值      | 内存中的字节（低地址到高地址） | 对应字符     |
| ------ | ---------- | --------------- | -------- |
| arr[0] | 0x00000000 | 00 00 00 00     | 空字符      |
| arr[1] | 0x6F796958 | 58 69 79 6F     | X i y o  |
| arr[2] | 0x694C2075 | 75 20 4C 69     | u 空格 L i |
| arr[3] | 0x2078756E | 6E 75 78 20     | n u x 空格 |
| arr[4] | 0x756F7247 | 47 72 6F 75     | G r o u  |
| arr[5] | 0x00000070 | 70 00 00 00     | p 空字符    |

**那后面的五句`printf`输出什么？**

需要对**大小端序**有了解！

- 小端模式下，低位字节存放在低地址处。例如 `0x6F796958` 在内存中排列为 `58 69 79 6F`，对应字符 `Xiyo`。

- 按照同样的方法读取后续整数，可以拼出 `Xiyou Linux Group`。

- 需要理解`printf("%s\n", ((struct data_box *)arr)->un.string);
	`%s` 会一直输出字符，直到遇到字符串结束符 `\0`。

 - 后四句`printf`的输出也是有关内存如何存放字节的。

不理解内存对齐与大小端序？看这个!
[大小端序](https://www.bilibili.com/video/BV12J41157Z1/)
[内存对齐](https://www.bilibili.com/video/BV1scmcBtETx/)

---

## 11. GNU/Linux & AI（选做）

> 注：嘿！你或许对 Linux 命令不是很熟悉，甚至没听说过 Linux；你或许对 AI 的了解仅仅止步于豆包，甚至只是听说过。但别担心，这是选做题，了解 Linux 和 AI 是加分项，但不了解也不扣分哦！
> 

### GNU/Linux

- 你知道 `ps aux` 命令所展示的结果是什么吗？
- 请你在 shell 下创建一个目录，然后在目录内创建几个文件并且列出它们，最后完整地删除整个目录。操作完成之后，请你解释一下，每个命令在整个流程中都起什么作用？请你进一步思考一下，Linux 系统的目录结构是什么？
- 你还了解哪些 Linux 的发行版？如果条件允许，你可以尝试安装一个你最喜欢的版本。

### 题解：

一、GNU/Linux

1. `ps aux` 的作用是什么？

   查看系统中的进程信息，包括进程编号、CPU 和内存占用等。
   
2. 动手试试！

3. 常见 Linux 发行版有哪些？

	Ubuntu、Debian、Fedora、Arch Linux、Linux Mint 等。

	可以试着安装Ubuntu！

### AI

- 模型（model）和智能体（agent）的区别是什么？你可以举一个实际的例子说明一下。
- skill 可以强化一个 agent 在某个问题上回答的专业能力，但是 skill 越多越好吗？
- 如果现在要求你使用 agent 来快速 vibe coding 一个项目，目前较为公认的流程是什么？如果条件允许，你可以尝试实现一个。

### 题解

1. 模型和智能体有什么区别？

	模型负责理解、推理和生成内容；智能体可以调用模型和工具来执行任务。
	
	例如，模型可以生成代码，而智能体还可以读取文件、运行代码、检查错误并尝试修复。

2. Skill 越多越好吗？

	不是。Skill 应该根据任务选择。无关的 Skill 可能增加上下文负担，反而影响执行效果。

3. 使用 Agent 进行 Vibe Coding 的基本流程是什么？

- 明确项目需求。

- 设计技术方案。

- 拆分任务并编写代码。

- 运行程序并测试。

- 根据错误反复修改。

-  检查结果，并使用 Git 管理版本。