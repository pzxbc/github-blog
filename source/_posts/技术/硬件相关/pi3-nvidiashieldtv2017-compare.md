title: 树莓派3-NvidiaShieldTV2017性能对比
date: 2018-12-07 21:20:01
updated: 2018-12-18 21:20:01
tags:
  - raspberry pi3
  - nvidia shield tv 2017
  - benchmark
---

更新：之前`Nvidia Shield TV`中安装的`Python`是`armv7`版本，更新为`aarch64`版本后，居然快比`armv7`版本快3倍！

```
~ # python3 -OO bench.py
4.9053307790309191 4.9530157269909978 4.9775087489979342
```

上述脚本在`armv7`版本下结果是15秒。说明`aarch64`相比于`armv7`架构性能提升是巨大的。

---
两者`bench`软件都是`armv7`版本的情况


找了两个benchmark的脚本，纯计算的话`NvidiaShieldTV2017`大概比`Pi3`快25%，综合的话大概是`Pi3`性能的两倍。


## 性能测试

### [`Benchmarker`](https://pypi.org/project/Benchmarker/)测试 

**Pi3**

```
pi@pi3:~/work $ python3 example.py -o result.json
## benchmarker:         release 4.0.1 (for python)
## python version:      3.5.3
## python compiler:     GCC 6.3.0 20170124
## python platform:     Linux-4.9.59-v7+-armv7l-with-debian-9.1
## python executable:   /usr/bin/python3
## cpu model:           ARMv7 Processor rev 4 (v7l)
## parameters:          loop=1000000, cycle=1, extra=0

##                        real    (total    = user    + sys)
(Empty)                 0.2927    0.3000    0.2900    0.0100
join                    2.6950    2.6800    2.6900   -0.0100
concat                  2.8989    2.8900    2.9000   -0.0100
format                  3.2807    3.2700    3.2800   -0.0100

## Ranking                real
join                    2.6950  (100.0) ********************
concat                  2.8989  ( 93.0) *******************
format                  3.2807  ( 82.1) ****************

## Matrix                 real    [01]    [02]    [03]
[01] join               2.6950   100.0   107.6   121.7
[02] concat             2.8989    93.0   100.0   113.2
[03] format             3.2807    82.1    88.4   100.0
```

**Nvidia Shield TV 2017**

```
darcy:/mnt/media_rw/5C58-53F6/projects # python3 example.py -o result.json
## benchmarker:         release 4.0.1 (for python)
## python version:      3.7.0
## python compiler:     GCC 7.3.0
## python platform:     Linux-3.10.96-tegra-armv8l-with-glibc2.4
## python executable:   /opt/bin/python3
## cpu model:           -
## parameters:          loop=1000000, cycle=1, extra=0

##                        real    (total    = user    + sys)
(Empty)                 0.1663    0.1500    0.1500    0.0000
join                    1.0292    0.9700    0.9600    0.0100
concat                  1.2687    1.2200    1.1900    0.0300
format                  1.4104    1.4300    1.4300    0.0000

## Ranking                real
join                    1.0292  (100.0) ********************
concat                  1.2687  ( 81.1) ****************
format                  1.4104  ( 73.0) ***************

## Matrix                 real    [01]    [02]    [03]
[01] join               1.0292   100.0   123.3   137.0
[02] concat             1.2687    81.1   100.0   111.2
[03] format             1.4104    73.0    90.0   100.0
```

### [SimpleCal](https://gist.github.com/apalala/3fbbeb5305584d2abe05)

**Pi3**

```
pi@pi3:~/work $ python3 -OO bench.py
19.282189759076573 19.284519216045737 19.288226678036153
```

**Nvidia Shield TV 2017**

```
130|darcy:/mnt/media_rw/5C58-53F6/projects # python3 -OO bench.py
15.1511479630135 15.185968587989919 15.258197338087484
```

## CPU硬件

两个设备都是4核的

### Pi3

```
pi@pi3:~/work $ cat /proc/cpuinfo
processor	: 0
model name	: ARMv7 Processor rev 4 (v7l)
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt vfpd32 lpae evtstrm crc32
CPU implementer	: 0x41
CPU architecture: 7
CPU variant	: 0x0
CPU part	: 0xd03
CPU revision	: 4

processor	: 1
model name	: ARMv7 Processor rev 4 (v7l)
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt vfpd32 lpae evtstrm crc32
CPU implementer	: 0x41
CPU architecture: 7
CPU variant	: 0x0
CPU part	: 0xd03
CPU revision	: 4

processor	: 2
model name	: ARMv7 Processor rev 4 (v7l)
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt vfpd32 lpae evtstrm crc32
CPU implementer	: 0x41
CPU architecture: 7
CPU variant	: 0x0
CPU part	: 0xd03
CPU revision	: 4

processor	: 3
model name	: ARMv7 Processor rev 4 (v7l)
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt vfpd32 lpae evtstrm crc32
CPU implementer	: 0x41
CPU architecture: 7
CPU variant	: 0x0
CPU part	: 0xd03
CPU revision	: 4

Hardware	: BCM2835
Revision	: a22082
Serial		: 000000002e84fae0
```

### Nvidia Shield TV 2017


```
darcy:/mnt/media_rw/5C58-53F6/projects # cat /proc/cpuinfo
processor	: 0
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt
CPU implementer	: 0x41
CPU architecture: 8
CPU variant	: 0x1
CPU part	: 0xd07
CPU revision	: 1

processor	: 1
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt
CPU implementer	: 0x41
CPU architecture: 8
CPU variant	: 0x1
CPU part	: 0xd07
CPU revision	: 1

processor	: 2
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt
CPU implementer	: 0x41
CPU architecture: 8
CPU variant	: 0x1
CPU part	: 0xd07
CPU revision	: 1

processor	: 3
BogoMIPS	: 38.40
Features	: half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt
CPU implementer	: 0x41
CPU architecture: 8
CPU variant	: 0x1
CPU part	: 0xd07
CPU revision	: 1

Hardware	: darcy
Revision	: 0000
Serial		: 0b4e0000a0000000
```