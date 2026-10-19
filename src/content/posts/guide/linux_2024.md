---
title: 西邮 Linux 兴趣小组 2024 纳新一面试题题解
published: 2026-10-19    # 发布日期
description: 既公公式式，又奇奇怪怪    # 显示在列表页的摘要
cover: /assets/images/kt.jpg    # 文章封面图（可选）
tags: [学习, C]      # 标签
category: 题解   # 分类
draft: false             # 是否为草稿
---

# 西邮 Linux 兴趣小组 2024 纳新面试题

- 本题目只作为西邮 Linux 兴趣小组 2024 纳新面试的有限参考。
- 为节省版面，本试题的程序源码省去了 `#include` 指令。
- 本试题中的程序源码仅用于考察 C 语言基础，不应当作为 C 语言「代码风格」的范例。
- 所有题目编译并运行于 x86_64 GNU/Linux 环境。

## 0. 聪明的吗喽

一个小猴子边上有 100 根香蕉，它要走过 50 米才能到家，每次它最多搬 50 根香蕉，（多了就拿不动了），它每走 1 米就要吃掉一根，请问它最多能把多少根香蕉搬到家里。

（提示：他可以把香蕉放下往返走，但是必须保证它每走一米都能有香蕉吃。也可以走到 n 米时，放下一些香蕉，拿着 n 根香蕉走回去重新搬 50 根。）

### 题解：

答案：

16根。

分析：

- 由提示可知，小猴如果想要回家时还有剩余的香蕉，就不能一开始就背50根走完50米，必定会折返一次。对于**前进->回到原点搬香蕉->继续前进**的过程，相当于小猴**每走一米就需要吃三根香蕉**。

- 当香蕉数量小于50之后，小猴就可以一次性搬完，不再需要折返。此时小猴**每走一米只需要消耗一根香蕉**。

- 对于第一阶段，小猴必须消耗香蕉至50以下，又因为小猴每走一米就需要吃三根香蕉，故小猴最多可走$50 \div 3 \approx 16.67$ 米，由于香蕉个数只能为整，倒推小猴走到16米的时候，吃掉48根香蕉，剩52根香蕉，**直接扔下两根**，搬50个回去，走剩下的$50-16=34$ 米，还可以留下$50-34=16$ 根香蕉。🐵
## 1. 西邮Linux欢迎你啊

请解释以下代码的运行结果。

```c
int main() {
    unsigned int a = 2024;
    for (; a >= 0; a--)
        printf("%d\n", printf("Hi guys! Join Linux - 2%d", printf("")));
    return 0;
}
```

### 题解：

输出：

```
Hi guys! Join Linux - 2024
Hi guys! Join Linux - 2024
Hi guys! Join Linux - 2024
...(无限循环)
```

分析：

- 内部的 `printf("")` 不输出内容，返回值为 0，因此字符串中的 `%d` 被替换为 0。外层 `printf` 输出内部 `printf` 的返回值，即 24。

- 由于`unsigned int`是无符号数，没有负值，无论怎么执行`a--`，a始终大于等于0，循环不会结束，所以会一直输出。

## 2. 眼见不一定为实

输出为什么和想象中不太一样？

你了解 `sizeof()` 和 `strlen()` 吗？他们的区别是什么？

```c
int main() {
    char p0[] = "I love Linux";
    const char *p1 = "I love Linux\0Group";
    char p2[] = "I love Linux\0";
    printf("%d\n%d\n", strcmp(p0, p1), strcmp(p0, p2));
    printf("%d\n%d\n", sizeof(p0) == sizeof(p1), strlen(p0) == strlen(p1));
    return 0;
}
```

### 题解：

输出：

```
0
0
0
1
```

分析：

- `strcmp` 和 `strlen` 遇到第一个 `\0` 就停止。`sizeof` 计算字节数，`strlen` 计算字符串有效字符的数量，可以理解为长度。

- `p0` 是字符数组，大小为 13 字节；`p1` 是指针，在 x86_64 GNU/Linux 环境环境中通常为 8 字节。

- `strcmp`的作用是按**字典序**逐字符比较两个以 `'\0'` 结尾的字符串。

	- 返回值小于 0：s1 小于 s2
    
	- 返回值等于 0：两字符串完全相等
    
	- 返回值大于 0：s1 大于 s2

## 3. 1.1 - 1.0 != 0.1

为什么会这样，除了下面给出的一种方法，还有什么方法可以避免这个问题？

```c
int main() {
    float a = 1.0, b = 1.1, ex = 0.1;
    printf("b - a == ex is%s\n", (b - a == ex) ? "true" : "false");
    int A = a * 10, B = b * 10, EX = ex * 10;
    printf("B - A == EX is%s\n", (B - A == EX) ? "true" : "false");
}
```

### 题解：

输出：

```
b - a == ex is false
B - A == EX is true
```

分析：

- `float`是浮点类型，浮点数采用二进制存储，部分十进制小数无法精确表示，因此直接比较两个浮点数会得到 `false`。

- 将浮点数乘以 10 转换为整数，可以避免的精度问题。

- **还能怎么处理？**

	使用容差(EPS)比较，`if (fabs(a - b) < EPS`，则认为相等。

## 4. 听说爱用位运算的人技术都不太差

解释函数的原理，并分析使用位运算求平均值的优缺点。

```c
int average(int nums[], int start, int end) {
    if (start == end)
        return nums[start];
    int mid = (start + end) / 2;
    int leftAvg = average(nums, start, mid);
    int rightAvg = average(nums, mid + 1, end);
    return (leftAvg & rightAvg) + ((leftAvg ^ rightAvg) >> 1);
}
```

### 题解：

输出：

无固定输出。

分析：

```c
(x & y) + ((x ^ y) >> 1)
```

- `x & y` 保留两个数二进制中都为 1 的位。
    
- `x ^ y` 保留两个数二进制中不同的位。
    
- 对非负整数，该表达式可以计算向下取整的平均值，并避免直接计算 `x + y` 时的部分溢出问题。

但原函数不一定能正确计算整个数组的平均值，因为左右两部分长度不同时，直接平均两部分的平均值通常 **不等于** 整个数组的平均值！

而且这么写，**可读性真的很差**，还可能出错！

举个栗子：

对于`[1, 1, 1, 4]`：

- 左 `(1+1)/2 = 1`，右 `(1+4)/2 = 2`
    
- 再平均 `(1+2)/2 = 1`，而真实的平均数是 `7/4 = 1.75`。**结果偏小**！

## 5. 全局还是局部!!!

先思考输出是什么，再动动小手运行下代码，看跟自己想得结果一样不一样 >-<

```c
int i = 1;
static int j = 15;
int func() {
    int i = 10;
    if (i > 5) i++;
    printf("i =%d, j =%d\n", i, j);
    return i % j;
}
int main() {
    int a = func();
    printf("a =%d\n", a);
    printf("i =%d, j =%d\n", i, j);
    return 0;
}
```

### 题解：

输出：

```
i = 11, j = 15
a = 11
i = 1, j = 15
```

分析：

- 函数中的局部变量 `i` 屏蔽了全局变量 `i`，执行 `i++` 后变为 11。
    
- 函数返回 `11 % 15`，结果为 11。
    
- 函数结束后，局部变量 `i` 不再存在，全局变量 `i` 仍为 1。
    
- `j` 是具有静态存储期的全局变量，值始终为 15。

## 6. 指针的修罗场：改还是不改，这是个问题

指出以下代码中存在的问题，并帮粗心的学长改正问题。

```c
int main(int argc, char **argv) {
    int a = 1, b = 2;
    const int *p = &a;
    int * const q = &b;
    *p = 3, q = &a;
    const int * const r = &a;
    *r = 4, r = &b;
    return 0;
}
```

### 题解：

**过不了编译!!!**

分析：

`const int *p` 表示不能通过 `p` 修改所指向的内容，但可以修改 `p` 的指向。

`int * const q` 表示不能修改 `q` 的指向，但可以通过 `q` 修改所指向的内容。

`const int * const r` 表示两者都不能修改。

所以四步操作全是错的！

- 有关指针常量和常量指针：
	- `const int *p`：`*p` 的值不能通过 `p` 修改，但 `p` 可以改变指向。
	这是**指向常量的指针**。

	- `int *const p`：`p` 的指向不能改变，但 `*p` 的值可以修改。
	这是**指针常量**。

	-  `const int *const p`：`p` 的指向不能改变，`*p` 的值也不能通过 `p` 修改。
	这是**指向常量的指针常量**。

## 7. 物极必反？

你了解 `argc` 和 `argv` 吗，这个程序里的 `argc` 和 `argv` 是什么？

程序输出是什么？解释一下为什么。

```c
int main(int argc, char *argv[]) {
    while (argc++ > 0);
    int a = 1, b = argc, c = 0;
    if (--a || b++ && c--)
        for (int i = 0; argv[i] != NULL; i++)
            printf("argv[%d] =%s\n", i, argv[i]);
    printf("a =%d, b =%d, c =%d\n", a, b, c);
    return 0;
}
```

### 题解：

输出：

```
a = 0, b = -2147483646, c = -1
```

分析：

- **argc 与 argv** 是什么？

	- `argc` 是参数个数，**包含程序名本身**。直接运行时 argc 通常等于 1。
	- `argv` 是字符指针数组，`argv[0]` 是程序名。

- `if (--a || b++ && c--)`是真是假？

	**为假！不会进入if语句**
	
	- 为什么？
	
		--a = 0 ，但跟的是||，不会短路，继续判断b++，b++为-2147483647，非0就是真，继续判断c--，c--在判断时取0，不满足&&，故整体的if条件为假，不执行。

**`while (argc++ > 0)`是什么？**

一直执行argc++，直到发生**整数溢出**，argc变为负数。

什么是整数溢出？

在c语言中，有标准库`<limits.h>`，其中有两个常用的常量：
	`INT_MIN`：`int` 类型的最小值（-2147483648）。
	`INT_MAX`：`int` 类型的最大值（2147483647）。
	当运算结果大于 `INT_MAX` 时，称为上溢；当运算结果小于 `INT_MIN` 时，称为下溢。

在 32 位补码表示中：
	
- 最大正数是 `2147483647` = `01111111111111111111111111111111`
	    
- 最小负数是 `-2147483648` = `10000000000000000000000000000000`

对于有符号整数溢出，虽然很多机器上会表现为**补码回绕**，但不能依赖这种结果！对于本题，argc在递增过程中达到INT_MAX，此时在进行argc++，argc会变成负数。

## 8. 指针？数组？数组指针？指针数组？

在主函数中定义如下变量：

```c
int main() {
    int a[2] = {4, 8};
    int(*b)[2] = &a;
    int *c[2] = {a, a + 1};
    return 0;
}
```

说说这些输出分别是什么？

```c
a, a + 1, &a, &a + 1, *(a + 1), sizeof(a), sizeof(&a)
*b, *b + 1, b, b + 1, *(*b + 1), sizeof(*b), sizeof(b)
c, c + 1, &c, &c + 1, **(c + 1), sizeof(c), sizeof(&c)
```

### 题解：

输出：

**第一组：**

- `a`、`a+1`：分别指向 `a[0]`、`a[1]`。
    
- `&a`：指向整个数组。
    
- `&a+1`：指向整个数组之后的位置。
    
- `*(a+1)`：8。
    
- `sizeof(a)`：8。
    
- `sizeof(&a)`：8。
    

**第二组：**

- `*b`：表示整个数组。
    
- `*b+1`：指向 `a[1]`。
    
- `b`：指向整个数组。
    
- `b+1`：指向整个数组之后的位置。
    
- `*(*b+1)`：8。
    
- `sizeof(*b)`：8。
    
- `sizeof(b)`：8。
    

**第三组：**

- `c`、`c+1`：分别指向 `c[0]`、`c[1]`。
    
- `&c`：指向整个指针数组。
    
- `&c+1`：指向整个数组之后的位置。
    
- `**(c+1)`：8。
    
- `sizeof(c)`：16。
    
- `sizeof(&c)`：8。
    

分析：

- `int (*b)[2]` 是数组指针，指向包含两个 `int` 的数组。
    
- `int *c[2]` 是指针数组，数组中有两个 `int *`。
    
- 数组名在多数表达式中会转换为首元素指针，**但 `sizeof` 等场景存在例外**。
    
- 指针加 1，移动的是一个所指类型的大小，而不是固定移动 1 字节。

为啥`sizeof` 等场景存在例外呢？

因为 `sizeof` 问的是"**这个对象占多少字节**"，而数组和指针是不同类型、不同大小。如果 `sizeof(a)` 里 `a` 也退化成指针，答案永远是 8，**就无法得知数组的真实大小**。数组大小是编译期已知的信息，`sizeof` 必须保留它。

## 9. 嘻嘻哈哈，好玩好玩

在宏的魔法下，数字与文字交织，猜猜结果是什么？

```c
#define SQUARE(x) x*x
#define MAX(a, b)(a> b)? a: b;
#define PRINT(x) printf("嘻嘻，结果你猜对了吗，包%d滴\n", x);
#define CONCAT(a, b) a##b

int main() {
    int CONCAT(x, 1) = 5;
    int CONCAT(y, 2) = 3;
    int max = MAX(SQUARE(x1 + 1), SQUARE(y2))
    PRINT(max)
    return 0;
}
```

### 题解：

输出：

```
嘻嘻，结果你猜对了吗，包11滴
```

分析：

- `CONCAT(x, 1)` 拼接成 `x1`，`CONCAT(y, 2)` 拼接成 `y2`。
    
- `SQUARE(x)` 没有给参数添加括号，`SQUARE(x1 + 1)` 展开为 `x1 + 1 * x1 + 1`，结果为 11。
    
- `SQUARE(y2)` 的结果为 9。
    
- `MAX` 比较 11 和 9，最终 `max` 为 11。

**##是什么？**

`##` 是 C 预处理器中的 **token 连接运算符**，也叫"连接运算符"。

**`##` 的作用：**

`##` 会把宏展开后它左右两边的 **预处理记号**拼接成一个新的记号。
也就是说 `x` 和 `1` 被拼成了标识符 `x1`，`y` 和 `2` 被拼成了 `y2`。

## 10. 我写的排序最快

写一个 `your_sort` 函数，要求不能改动 `main` 函数里的代码，对 `arr1` 和 `arr2` 两个数组进行升序排序并剔除相同元素，最后将排序结果放入 `result` 结构体中。

```c
int main() {
    int arr1[] = {2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 10};
    int arr2[] = {2, 1, 4, 3, 9, 6, 8};
    int len1 = sizeof(arr1) / sizeof(arr1[0]);
    int len2 = sizeof(arr2) / sizeof(arr2[0]);

    result result;
    your_sort(arr1, len1, arr2, len2, &result);
    for (int i = 0; i < result.len; i++) {
        printf("%d ", result.arr[i]);
    }
    free(result.arr);
    return 0;
}
```

### 题解：

代码：

```c
#include <stdio.h>

#include <stdlib.h>

typedef struct{

    int *arr;

    int len;

}result;

  

void your_sort(int* arr1, int len1, int* arr2, int len2, result *res)

{

    int len = len1 + len2;

    int *arr = malloc(len * sizeof(int));

  

    for(int i=0;i<len1;i++){

        arr[i] = arr1[i];

    }

    for(int i=0;i<len2;i++){

        arr[i+len1] = arr2[i];

    }

  

    for(int i=0;i<len-1;i++){

        for(int j=0;j<len-1-i;j++){

            if(arr[j]>arr[j+1]){

                int temp = arr[j];

                arr[j] = arr[j+1];

                arr[j+1] = temp;

            }

        }

    }

  

    res->len = 0;

    for(int i=0;i<len;i++){

        if(i==0 || arr[i]!=arr[i-1]){

            arr[res->len++] = arr[i];

        }

    }

    res->arr = arr;

}

  

int main() {

    int arr1[] = {2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 10};

    int arr2[] = {2, 1, 4, 3, 9, 6, 8};

    int len1 = sizeof(arr1) / sizeof(arr1[0]);

    int len2 = sizeof(arr2) / sizeof(arr2[0]);

  

    result result;

    your_sort(arr1, len1, arr2, len2, &result);

    for (int i = 0; i < result.len; i++) {

        printf("%d ", result.arr[i]);

    }

    free(result.arr);

    return 0;

}
```

排序这一块可供选择的很多，如冒泡，快排，插入等，由于此题数据量不大，故使用冒泡比较简单。
去重由于数据已经排好序了，用`arr[i]!=arr[i-1]`比较简单。

## 11. 猜猜我是谁

在指针的迷宫中，五个数字化身为神秘的符号，等待被逐一揭示。

```c
int main() {
    void *a[] = {(void *)1, (void *)2, (void *)3, (void *)4, (void *)5};
    printf("%d\n", *((char *)a + 1));
    printf("%d\n", *(int *)(char *)a + 1);
    printf("%d\n", *((int *)a + 2));
    printf("%lld\n", *((long long *)a + 3));
    printf("%d\n", *((short *)a + 4));
    return 0;
}
```

### 题解：

输出：

```
0
2
2
4
2
```

分析：

`void *a[] = {(void *)1, (void *)2, (void *)3, (void *)4, (void *)5};`是什么？

- 这是一个 **指针数组**，5 个元素，每个元素是 `void *`。在 64 位系统上，每个指针 8 字节，数组共 40 字节。内存里存的是这些整数值：

|偏移(字节)|0-7|8-15|16-23|24-31|32-39|
|---|---|---|---|---|---|
|值|1|2|3|4|5|

即内存字节序列（小端）：`01 00 00 00 00 00 00 00 | 02 00 00 00 00 00 00 00 | 03 00 00 00 00 00 00 00 | 04 00 00 00 00 00 00 00 | 05 00 00 00 00 00 00 00`。

不理解内存对齐与大小端序？看这个!
[大小端序](https://www.bilibili.com/video/BV12J41157Z1/)

#### `printf("%d\n", *((char *)a + 1));`

- `(char *)a`：把数组首地址转成 `char *`。
    
- `+ 1`：偏移 **1 个字节**，指向地址 `a + 1`（即第 2 个字节）。
    
- `*`：读 1 个字节，得到 `0x00` = **0**。
    
- 输出：**0**。

#### 2. `printf("%d\n", *(int *)(char *)a + 1);`

- `(char *)a`：首地址。
    
- `(int *)`：再转成 `int *`，按 **4 字节**读。
    
- `*`：读前 4 字节 → `0x00000001` = **1**。
    
- `+ 1`：算术加 1 → **2**。
    
- 输出：**2**
    

 注意这里 `+1` 在解引用**之后**，是数值加 1，不是指针偏移。

#### 3. `printf("%d\n", *((int *)a + 2));`

- `(int *)a`：按4字节读。
    
- `+ 2`：指针偏移 **2 个 int = 8 字节**，指向偏移 8 处，正好是第 2 个元素（值 2）的起始。
    
- `*`：读 4 字节 → **2**。
    
- 输出：**2**

#### 4. `printf("%lld\n", *((long long *)a + 3));`

- `(long long *)a`：按 8 字节读。
    
- `+ 3`：偏移 **3 × 8 = 24 字节**，指向第 4 个元素（值 4）起始。
    
- `*`：读 8 字节 → **4**。
    
- 输出：**4**
    

#### 5. `printf("%d\n", *((short *)a + 4));`

- `(short *)a`：按 2 字节读。
    
- `+ 4`：偏移 **4 × 2 = 8 字节**，指向偏移 8 处（第 2 个元素起始）。
    
- `*`：读 2 字节 → 低 16 位 `0x0002` = **2**。
    
- 输出：**2**

## 12. 结构体变小写奇遇记

计算出 `Node` 结构体的大小，并解释以下代码的运行结果。

```c
union data {
    int a;
    double b;
    short c;
};
typedef struct node {
    long long a;
    union data b;
    void (*change)( struct node *n);
    char string[0];
} Node;
void func(Node *node) {
    for (size_t i = 0; node->string[i] != '\0'; i++)
        node->string[i] = tolower(node->string[i]);
}

int main() {
    const char *s = "WELCOME TO XIYOULINUX_GROUP!";
    Node *P = (Node *)malloc(sizeof(Node) + (strlen(s) + 1) * sizeof(char));
    strcpy(P->string, s);
    P->change = func;
    P->change(P);
    printf("%s\n", P->string);
    return 0;
}
```

### 题解：

输出：

```
welcome to xiyoulinux_group!
```

分析：

**sizeof(Node)是多少?**

- 先看 union，成员里最大的是 double，占 8 字节且要求 8 字节对齐，所以整个 union 是 8 字节。

- 再看结构体：

| 偏移      | 成员                              | 大小  | 对齐要求 |
| ------- | ------------------------------- | --- | ---- |
| 0 到 7   | `long long a`                   | 8   | 8    |
| 8 到 15  | `union data b`                  | 8   | 8    |
| 16 到 23 | `void (*change)(struct node *)` | 8   | 8    |
| 24      | `char string[0]`                | 0   | 1    |

三个 8 字节成员首尾相接，故`sizeof(Node)`大小为24。

**malloc了多大？**

`strlen(s)` 是 28，加 1 存空字符，一共 29 字节。`24 + 29 = 53` 字节。

**strcpy了什么？**

`strcpy` 从偏移 24 开始写，正好落在多申请的那段字节里。

**void (\*change)(struct node \*n)**是什么？

它表示 `change` 是一个函数指针，指向一个满足以下条件的函数：

- 返回类型为 `void`。
    
- 接收一个 `struct node *` 类型的参数。

所以之后执行`P->change = func;`是ok的。

**func()函数是干什么的？**

逐个访问字符，通过`tolower()`将大写字母转换为小写字母。

**最后是怎么输出字符串的？**

```c
P->change = func;
P->change(P);

printf("%s\n", P->string);
```

- 通过函数指针调用 `func(P)`。

- `func` 修改 `P->string` 中的字符。

- `printf` 输出修改后的字符串。


## 13. GNU/Linux (选做)

注：嘿！你或许对Linux命令不是很熟悉，甚至没听说过Linux。

但别担心，这是选做题，了解Linux是加分项，不了解也不扣分哦！

- 你知道 `ls` 命令的用法与 `/` `.` `~` 这些符号的含义吗？
- 你知道 Linux 中权限 `rwx` 的含义吗？
- 请问你还懂得哪些与 GNU/Linux 相关的知识呢~

### 题解：

- `ls`：列出目录内容；`ls -l`：显示详细信息。
    
- `/`：根目录；`.`：当前目录；`~`：当前用户的主目录。
    
- `r`：读取权限；`w`：写入权限；`x`：执行权限。
    
- `cd`：切换目录；`pwd`：查看当前目录；`mkdir`：创建目录；`cp`：复制文件；`mv`：移动或重命名；`rm`：删除文件。

Linux 是一种操作系统内核，GNU 提供了大量常用的系统工具。GNU/Linux 系统可以通过终端命令完成文件管理、程序编译和系统操作等任务。