---
title: 西邮 Linux 兴趣小组 2025 纳新一面试题题解
published: 2026-10-17    # 发布日期
description: 第十题要是能传指针就好了...    # 显示在列表页的摘要
cover: /assets/images/mht.jpg    # 文章封面图（可选）
tags: [学习, C]      # 标签
category: 题解   # 分类
draft: false             # 是否为草稿
---

# 西邮 Linux 兴趣小组 2025 纳新面试题

- 本题目只作为西邮 Linux 兴趣小组 2025 纳新面试的有限参考。
- 为节省版面，本试题的程序源码省去了 `#include` 指令。
- 本试题中的程序源码仅用于考察 C 语言基础，不应当作为 C 语言「代码风格」的范例。
- 所有题目编译并运行于 **x86_64 GNU/Linux** 环境。

## 0. 拼命的企鹅

一只企鹅在爬山，每隔一段路都会遇到一块石头。第 1 块石头重量是 `a`，每往上走一段路，石头重量就会变成上一段的平方。企鹅可以选择把某些石头捡起来，最后把捡到的石头重量相乘。

它怎样捡石头，才能得到重量乘积恰好是 `a` 的 `b` 次方的石头？（比如 `b = 173` 时， 要捡哪些石头？）

### 题解：

答案：

b = 173时，需要捡**1、3、4、6、8**块。
推广至其他情况，本质是**把 b 转换成二进制，哪些位是 1，就捡对应编号的石头。**

分析：

题目描述了这样一个过程：$b=2^{k1}​+2^{k2​}+...$

以`b = 173`为例：

| 石头编号 i |   重量    |    指数    | b = 173 的这一位 |
| :----: | :-----: | :------: | :----------: |
|   1    |  `a^1`  |  2⁰ = 1  |     1，要捡     |
|   2    |  `a^2`  |  2¹ = 2  |      0       |
|   3    |  `a^4`  |  2² = 4  |     1，要捡     |
|   4    |  `a^8`  |  2³ = 8  |     1，要捡     |
|   5    | `a^16`  | 2⁴ = 16  |      0       |
|   6    | `a^32`  | 2⁵ = 32  |     1，要捡     |
|   7    | `a^64`  | 2⁶ = 64  |      0       |
|   8    | `a^128` | 2⁷ = 128 |     1，要捡     |

## 1. 西邮Linux欢迎你啊

请解释以下代码的运行结果。

```c
int main() {
    if (printf("Hi guys! ") || printf("Xiyou Linux ")) {
        printf("%d\n", printf("Welcome to Xiyou Linux 2%d", printf("")));
    }
    return 0;
}
```

### 题解：

输出：

```
Hi guys! Welcome to Xiyou Linux 2025
```

分析：

1. `printf` 返回成功输出的字符数。第一个 `printf` 返回非零值，因此 `||` **短路**，第二个 `printf` 不会执行。

2. 内层 `printf("")` 返回 `0`，所以后面的格式化输出相当于输出 `Welcome to Xiyou Linux 20`，共输出 25 个字符，返回值为 `25`。


## 2. 可以和 `\0` 组一辈子字符串吗？

你能找到成功打印的语句吗？你能看出每个 `if` 中函数的返回值吗？这些函数各有什么特点？

```c
int main() {
    char p1[] = { 'W', 'e', 'l', 'c', 'o', 'm', 'e', '\0' };
    char p2[] = "Join us\0", p4[] = "xiyou_linux_group";
    const char* p3 = "Xiyou Linux Group\0\n2025\0";
    if (strcmp(p1, p2)) {
        printf("%s to%s!\n", p1, p2);
    }
    if (strlen(p3) > sizeof(p3)) {
        printf("%s", p3);
    }
    if (sizeof(p1) == sizeof(p2)) {
        printf("%s", p4);
    }
    return 0;
}
```

### 题解：

输出：

```
Welcome to Join us! 
Xiyou Linux Group
```

分析：

- `strcmp(p1,p2)`：两个字符串不同，返回非零值，因此第一个 `if` 成立。(**字典序**比较)

- `strlen(p3)`：只统计第一个 `\0` 之前的字符数，不包括 `\0`。

- `sizeof(p3)`：`p3` 是指针，64 位环境中通常为 8 字节。`strlen(p3)` 大于 8，因此第二个 `if` 成立。

- `sizeof(p1)` 为 8，`sizeof(p2)` 为 9，因为 `p2` 中写入的 `\0` 后面还有字符串自动添加的结束符。因此第三个 `if` 不成立。

有关字典序：[字典序](https://www.cnblogs.com/K2MnO4/p/12578803.html)


## 3. 数学没问题，浮点数有鬼

这个程序的输出是什么？解释为什么会这样？

```c
int main() {
    float a1 = 0.3, b1 = 6e-1, sum1 = 0.9;
    printf("a1 + b1%s sum1\n", (a1 + b1 == sum1) ? "==" : "!=");
    float a2 = 0x0.3p0, b2 = 0x6p-4, sum2 = 0x0.9p0;
    printf("a2 + b2%s sum2\n", (a2 + b2 == sum2) ? "==" : "!=");
    return 0;
}
```

### 题解：

输出：

```
a1 + b1 != sum1
a2 + b2 == sum2
```

分析：

1. 第一组的`float` 使用二进制浮点表示，但很多十进制小数无法被二进制浮点数精确表示。并且，浮点数的精度也有限。

2. 第二组的`float`使用**十六进制浮点常量**表示：

	`0x0.3p0` = 3 / 16 = 0.1875
	`0x6p-4` = 6 / 16 = 0.375
	`0x0.9p0` = 9 / 16 = 0.5625
	
	$3 + 6 = 9$ 在实数里成立，在二进制里同样成立，因为这三个数的分母都是**2 的幂**，中间的每一步都落在 float 能精确表达的格点上。比较运算于是得到相等。

有关浮点数：

[浮点数的底层原理和精度损失问题](https://zhuanlan.zhihu.com/p/269619376)

[如何在C程序中用十六进制表示浮点数？](https://www.volcengine.com/article/848744)


## 4. 不合群的数字

在一个数组中，所有数字都出现了偶数次，只有两个数字出现了奇数次，请聪明的你帮我看看以下的代码是如何找到这两个数字的呢？

```c
void findUndercoverIDs(int nums[], int size) {
    int xorAll = 0,id_a = 0,id_b = 0;
    for (int i = 0; i < size; i++) {
        xorAll ^= nums[i];
    }
    int diffBit = xorAll & -xorAll;
    for (int i = 0; i < size; i++) {
        if(nums[i] & diffBit){
            id_a ^= nums[i];
        } else {
            id_b ^= nums[i];
        }
    }
    printf("These nums are%d%d\n", id_a, id_b);
}
```

分析：

- 为什么要全部异或一次？

1. `x ^ x = 0`：成对的数互相抵消。
2. `x ^ 0 = x`：抵消剩下的就是答案。

- 设不同的两个数为A，B。由于A和B都只出现一次，所以A≠B，所以在异或和中必然有个比特位上的值是1。A和B在这个比特位上，其中一个是0，另一个是1。

- `int diffBit = xorAll & -xorAll`是什么？
	这是补码下提取最低位 1 的经典写法 (**lowbit**)。

- 第二次for循环：
	再次遍历`nums`，对于这个比特位，把值为0的数分到一组，值为1的数分到另一组。那么A和B必然分到不同的组中。现在，同一组内只有一个数出现一次，其余数都出现了两次，计算每一组的异或和，就是答案。


leetcode题解：[题解](https://leetcode.cn/problems/single-number-iii/solutions/2484352/tu-jie-yi-zhang-tu-miao-dong-zhuan-huan-np9d2)


## 5. 会一直循环吗？

你了解 `argc` 和 `argv` 吗，程序的输出是什么？为什么会这样？

```c
int main(int argc, char* argv[]) {
    printf("argc = %d\n", argc);
    while (argc++ > 0) {
        if(argc < 0){
            printf("argv[0]%s\n", argv[0]);
            break;
        }
    }
    printf("argc = %d\n", argc);
    return 0;
}
```

### 题解：

输出：

```
argc = 1
argv[0]."test.exe（程序自身的名字）
argc = -2147483648
```

分析：

- `argc`：命令行参数的**个数**，是整数。
- `argv[0]` 是**程序自身的名字**（不是第一个用户参数）。
-  真正的参数从 `argv[1]` 开始。

程序不会一直循环，在`argc`< 0时触发break。此时发生**整数溢出**。

什么是整数溢出？

在c语言中，有标准库`<limits.h>`，其中有两个常用的常量：
	`INT_MIN`：`int` 类型的最小值（-2147483648）。
	`INT_MAX`：`int` 类型的最大值（2147483647）。
	当运算结果大于 `INT_MAX` 时，称为上溢；当运算结果小于 `INT_MIN` 时，称为下溢。

在 32 位补码表示中：
	
- 最大正数是 `2147483647` = `01111111111111111111111111111111`
	    
- 最小负数是 `-2147483648` = `10000000000000000000000000000000`

对于有符号整数溢出，虽然很多机器上会表现为**补码回绕**，但不能依赖这种结果！对于本题，argc在递增过程中达到INT_MAX，此时在进行argc++，argc会变成负数，触发break！

## 6. `const` 与指针：谁能动，谁不能动？

```c
struct P {
    int x;
    const int y;
};

int main() {
    struct P p1 = { 10, 20 }, p2 = { 30, 40 };
    const struct P p3 = { 50, 60 };
    struct P* const ptr1 = &p1;
    const struct P* ptr2 = &p2;
    const struct P* const ptr3 = &p3;
    return 0;
}
```

说说下列操作是否合法，并解释原因：

`ptr1->x = 100`, `ptr2->x = 300`, `ptr3->x = 500`

`ptr1->y = 200`, `ptr1 = &p2`, `ptr2->y = 400`

`ptr2 = &p1`, `ptr3->y = 600`, `ptr3 = &p1`

### 题解：

答案：

| 序号  |        操作        | 结果  |
| :-: | :--------------: | :-: |
|  1  | `ptr1->x = 100;` | 合法  |
|  2  | `ptr2->x = 300;` | 非法  |
|  3  | `ptr3->x = 500;` | 非法  |
|  4  | `ptr1->y = 200;` | 非法  |
|  5  |  `ptr1 = &p2;`   | 非法  |
|  6  | `ptr2->y = 400;` | 非法  |
|  7  |  `ptr2 = &p1;`   | 合法  |
|  8  | `ptr3->y = 600;` | 非法  |
|  9  |  `ptr3 = &p1;`   | 非法  |

分析：

- `int * const p`：指针本身不能修改指向。

- `const int *p`：不能通过该指针修改所指向的值。

- `const int * const p`：两者都不能修改。

- `const` 结构体成员不能直接修改。

	理解之后很容易判断是否合法。

有个自用的方法：

指针那一块，`p` 是指针本身，`*p` 可以理解为指针指向的值。理解这一个之后，可以很快地分辨是指针指向不能动，还是指针指向的值不能动。

- `const int *p`：`*p` 的值不能通过 `p` 修改，但 `p` 可以改变指向。
	这是**指向常量的指针**。
- `int *const p`：`p` 的指向不能改变，但 `*p` 的值可以修改。
	这是**指针常量**。
- `const int *const p`：`p` 的指向不能改变，`*p` 的值也不能通过 `p` 修改。
	这是**指向常量的指针常量**。


## 7. 指针！数组!

在主函数中定义如下变量:

```c
int main() {
    int a[3] = { 2, 4, 8 };
    int(*b)[3] = &a;
    int* c[3] = { a, a + 1, a + 2 };
    int (*f1(int))(int*, int);
    return 0;
}
```

说说这几个表达式的输出分别是什么？

`a`, `*b`, `*b + 1`, `b`, `b + 1`, `*(*b + 1)`, `c`, `sizeof(a)`, `sizeof(b)`, `sizeof(&a)`, `sizeof(f1)`

### 题解：

输出：

| 表达式          | 类型           | 值           | 说明                    |
| :----------- | :----------- | :---------- | :-------------------- |
| `a`          | `int*`（退化后）  | &a[0]       | 数组名退化为首元素地址           |
| `*b`         | `int*`（退化后）  | &a[0]       | b 指向整个数组，*b 得到数组，随即退化 |
| `*b + 1`     | `int*`       | &a[1]       | 步长 4 字节               |
| `b`          | `int(*)[3]`  | &a          | 与 a 数值相同              |
| `b + 1`      | `int(*)[3]`  | &a 再加 12 字节 | 步长是一整个数组              |
| `*(*b + 1)`  | `int`        | 4           | 即 a[1]                |
| `c`          | `int**`（退化后） | &c[0]       | 指针数组的名字退化为指向首元素的指针    |
| `sizeof(a)`  | `size_t`     | 12          | 3 个 int，共 12 字节       |
| `sizeof(b)`  | `size_t`     | 8           | 指针宽度                  |
| `sizeof(&a)` | `size_t`     | 8           | 指针宽度                  |
| `sizeof(f1)` |              | 1（其实是非法的）   | 对函数类型取 sizeof，标准不允许   |


分析：

首先，明确一点：**数组名在大多数表达式中会“退化”为指向其首元素的指针**。

- 为什么？

C 语言设计之初就规定：**函数参数不能是数组类型**。因为数组可能很大，如果按值传递整个数组，每次调用都要复制一份，开销巨大。

所以规定：当数组作为函数参数时，它自动退化为指针，函数收到的是首地址。这样传递的只是一个地址，效率更高。

- 为什么有时候对地址+1前进一个`int`的大小，有时候前进一整个数组的大小呢?

`a` 和 `&a` 的地址数值通常相同，但类型不同。`a + 1` 移动一个 `int` 的大小，而 `&a + 1` 移动整个数组的大小。


[c语言中如何传递数组](https://docs.pingcode.com/baike/1314722)


## 8. 全局还是局部！！！

观察程序输出，思考为什么？

```c
int g;
int func() {
    static int j = 98;
    j += g;
    return j;
}

int main() {
    g += 3;
    char arr[6] = {};
    arr[1] = func();
    arr[0] = func();
    arr[2] = arr[3] = func() + 1;
    arr[4] = func() + 1;
    printf("%s linux\n",arr);
    return 0;
}
```

### 题解：

输出：

```
hello linux
```

分析：

`g` 是全局变量，初始化默认为 `0`。执行 `g += 3` 后，`g` 变为 `3`。

`j` 是静态局部变量，只初始化一次，初值为 `98`。每次调用 `func()`，都会增加 `3`。

五次调用返回的值依次为：

```
101 104 107 110 113
```

经过赋值后，`arr` 中的字符依次为 `h`、`e`、`l`、`l`、`o`，最后自动补上 `\0`。


## 9. 宏函数指针

观察程序结果，说说程序运行的过程：

```c
#define CALL_MAIN(main, x)(*(int(*)(int))*main)(x);
#define DOUBLE(x)2* x
int (*registry[1])(int);
int main(int argc) {
    if (argc > 2e3) return 0;
    printf("%d ", argc + 1);
    *registry = (int(*)(int))main;
    CALL_MAIN(registry, DOUBLE(argc + 1));
    return 0;
}
```


### 题解：

输出：

```
2 4 8 16 32 64 128 256 512 1024
```

分析：

- `int (*registry[1])(int);`是什么？

	registry 是一个长度为1的数组，数组的唯一元素是一个函数指针，该函数指针指向**接受一个 int 参数、返回 int**的函数。

- `#define CALL_MAIN(main, x)(*(int(*)(int))*main)(x);`是什么？

	1. `(int(*)(int))` 是一个函数指针，该函数指针指向**接受一个 int 参数、返回 int**的函数。2
	2. `*main`对main函数解引用，得到main函数的内容。
	3. `(int(*)(int))*main`将`*main`得到的内容强制转换为`(int(*)(int))` 类型的函数指针。
	4. `(*(int(*)(int))*main)`解引用强制转换后的函数，得到函数本身。
	5. `(*(int(*)(int))*main)(x)`传入参数`x`，调用这个函数。

- `DOUBLE(argc + 1)`得到的是什么？
	`2*argc+1`，注意做的是纯文本替换。

- `CALL_MAIN(registry, DOUBLE(argc + 1));`是什么？

	1. 第一步展开：`(*(int(*)(int))*registry)(DOUBLE(argc + 1));`
	2. 第二步展开：`(*(int(*)(int))*registry)(2* argc + 1);`

- 递归过程如何？

| 层   | argc | 打印值（argc + 1） | 递归调用参数    |
| --- | ---- | ------------- | --------- |
| 1   | 1    | 2             | 2*1+1 = 3 |
| 2   | 3    | 4             | 7         |
| 3   | 7    | 8             | 15        |
| 4   | 15   | 16            | 31        |
| 5   | 31   | 32            | 63        |
| 6   | 63   | 64            | 127       |
| 7   | 127  | 128           | 255       |
| 8   | 255  | 256           | 511       |
| 9   | 511  | 512           | 1023      |
| 10  | 1023 | 1024          | 2047      |
在第11层时，$2047>2e3$ ，返回。


## 10. 拼接 排序 去重

本题要求你编写以下函数，不能改动 `main` 函数里的代码。实现对 `arr1` 和 `arr2` 的拼接、排序和去重。你需要自行定义 `result` 结构体并使用 `malloc` 手动开辟内存。

```c
int main() {
    int arr1[] = { 6, 1, 2, 1, 9, 1, 3, 2, 6, 2 };
    int arr2[] = { 4, 2, 2, 1, 6, 2 };
    int len1 = sizeof(arr1) / sizeof(arr1[0]);
    int len2 = sizeof(arr2) / sizeof(arr2[0]);

    struct result result;
    your_concat(arr1, len1, arr2, len2, result);
    print_result(result);
    your_sort(result);
    print_result(result);
    your_dedup(result);
    print_result(result);
    free(result.arr);
    return 0;
}
```


## 11. 指针魔法

用你智慧的眼睛，透过这指针魔法的表象，看清其本质：

```c
void magic(int(*pa)[6], int** pp) {
    **pp += (*pa)[2];
    *pp = (*pa) + 5;
    **pp -= (*pa)[0];
    *pp = (*pa) + ((*(*pa + 3) & 1) ? 3 : 1);
    *(*pp) += *(*pp - 1);
    *pp = (*pa) + 2;
}
int main() {
    int a[6] = { 2, 4, 6, 8, 10, 12 };
    int* p = a + 1,** pp = &p;
    magic(&a, pp);
    printf("%d %d\n%d %d %d\n%d %d\n",*p,**pp,a[1],a[2],a[3],a[5],p-a);
    return 0;
}
```

### 题解：

输出：

```
6 6
12 6 8
10 2
```

分析：

```
a = {2,4,6,8,10,12};
p = a + 1;
```

此时 `p` 指向 `a[1]`，即 `*p = 4`。

1.

```
**pp += (*pa)[2];
```

`**pp` 就是 `*p`，即 `a[1]`。
`(*pa)[2]` 就是 `a[2]`。

因此 `a[1] = 4 + 6 = 10`。

2.

```
*pp = (*pa) + 5;
```

修改 `p` 的指向，使其指向 `a[5]`。

3.

```
**pp -= (*pa)[0];
```

此时 `p` 指向 `a[5]`，所以 `a[5] = 12 - 2 = 10`。

4.

```
*pp = (*pa) + ((*(*pa + 3) & 1) ? 3 : 1);
```

`*(*pa + 3)` 就是 `a[3] = 8`。因为 `8 & 1` 的结果为 `0`，所以选择 `1`，令 `p = a + 1`。

- 1000 & 0001 的结果是0000，即 0 ，条件为假。

5.

```
*(*pp) += *(*pp - 1);
```

此时 `p` 指向 `a[1]`，相当于：

```
a[1] += a[0];
```

所以 `a[1] = 10 + 2 = 12`。

最后：

```
*pp = (*pa) + 2;
```

令 `p` 指向 `a[2]`。

最终数组为：

```
2 12 6 8 10 10
```

此时 `*p = 6`，`**pp = 6`，`p - a = 2`。


有关**指针退化**内容，详见题7。


## 12. 奇怪的循环

你能看明白这个程序怎样运行吗？试着理解这个程序吧！

```c
union data {
    void**** p;
    char arr[20];
};
typedef struct node {
    int a;
    union data b;
    void (*use)(struct node* n);
    char string[0];
} Node;
void func2(Node* node);

void func1(Node* node) {
    node->use = func2;
    printf("%s\n", node->string);
}
void func2(Node* node) {
    node->use = func1;
    printf("%d\n", ++(node->a));
}
int main() {
    const char* s = "Your journey begins here!";
    Node* P = (Node*)malloc(sizeof(Node) + (strlen(s) + 1) * sizeof(char));
    strcpy(P->string, s);
    P->use = func1;
    P->a = sizeof(Node) * 50 + sizeof(union data);
    while (P->a < 2028) {
        P->use(P);
    }
    free(P);
    return 0;
}
```


### 题解：

输出：

```
Your journey begins here! 2025 
Your journey begins here! 2026 
Your journey begins here! 2027 
Your journey begins here! 2028
```

分析：

- 先算sizeof，平台为x86_64 Linux，指针 8 字节。

| 类型           | 成员                                                           | 大小与对齐                  | 结论       |
| ------------ | ------------------------------------------------------------ | ---------------------- | -------- |
| `union data` | `void**** p` 与 `char arr[20]`                                | 最大成员 20，最大对齐 8         | 大小补齐到 24 |
| `Node`       | `int a`（偏移 0）、`union data b`（偏移 8）、`void (*use)(...)`（偏移 32） | b 需要 8 字节对齐，a 后面补 4 字节 | 大小 40    |


**P->a = sizeof(Node) * 50 + sizeof(union data) = 40 * 50 + 24 = 2024**



- `func1`：打印字符串，并把下一次调用的函数切换为 `func2`。

- `func2`：把整数加 1 并打印，同时把下一次调用的函数切换为 `func1`。

- `node->use = func2`：修改函数指针，让它指向 `func2`。

- `P->use(P)`：调用 `use` 当前指向的函数，因此两个函数交替执行。



因为**函数指针**会**改变指向**，所以同一行调用代码可以交替执行不同的函数。


## 13. GNU/Linux (选做)

注：嘿！你或许对 Linux 命令不是很熟悉，甚至你没听说过 Linux。但别担心，这是选做题，了解 Linux 是加分项，但不了解也不扣分哦！

1. 你知道 `cd` 命令的用法与 `/` `~` 这些符号的含义吗？
2. 你知道 Linux 系统如何创建和删除一个目录吗？
3. 请问你还懂得哪些与 GNU/Linux 相关的知识呢？


### 题解：

1. `cd`：切换目录。`/` 表示根目录，`~` 表示当前用户的主目录，`-` 表示上一次所在的目录。

2. 创建目录使用 `mkdir`，删除空目录使用 `rmdir`，删除文件使用 `rm`。

3. 常用命令还有：
    
    - `ls`：列出目录内容。
        
    - `pwd`：显示当前目录。
        
    - `cp`：复制文件。
        
    - `mv`：移动或重命名文件。
        

Linux 是一种类 Unix 操作系统，GNU 提供了许多常用的系统工具。学习 Linux 命令有助于理解程序运行环境和日常开发流程。