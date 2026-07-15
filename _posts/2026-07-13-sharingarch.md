---
layout: post
title: "My MS thesis work on enabling higher multicore performance through
workload sharing"
---
Before I move to UVA and forget a lot of the details on what I did for my MS
project, I wanted to have this writeup for legacy purposes and also so that in
the future I revisit and see how far I've come.

Many of the images in this blog will be copied from a slide deck that I did to
present to ArchLab. That is why they would appear a bit unprofessional, because
I wanted to have some fun.

## Motivation
When you are normally using your machine, a process which could be single or
multi-threaded, will typically be decided by the OS to be scheduled to run on
only one CPU core. I devise that this is done so because semantically it is the
most understandable when it comes to setting up things like virtual memory
address space, ease of load/stores to memory which is more easily handled by
just having the process on one core, etc.

![js put the instructions in the queue bro](/blog/sharing-arch-images/fries.png)

In the image above, you can see on the left the process I described. The image
shows 10 (logical) cores, where core 6 is occupied by a user running some kind
of vcs process which will take a few hours. The main problem we try to debate is
the inflexibility that this shows. This one vcs process could take hours, but
not because we don't have enough compute, because we do, they are just
idle. The crux is, why don't and how do we utilize these idle resources?


Now, lets not think about the
practicality of virtual mem, coherence and such as you look at the right image.
This image is meant to portray the simplistic view I try to describe, that all
programs and processes are in essence, a stream of instructions. Then, with that
in mind, what if instead of running those, lets say 1 trillion instructions on
core 6, why don't we split the stream into 2,5, or even 10, so that the idle
cores can come alive and do some work for us? This idea is described under the
research category of ***distributed ILP architectures***

A summary of some prior work done on such architectures are shown the slide below.

![distributed ilp](/blog/sharing-arch-images/dilp.png)

The main idea here is that we very simply either enable someone to be aware of
this resource sharing capability between cores that are spiced up with custom
hardware to allow this, such that this someone (could be OS, compiler, more
software-side) will perform the arbitration upon scheduling a program, or, we
design the hardware such that this arbitration is performed in the hardware,
with the crux of software deciding how many cores form a group. The latter is
described in *The Sharing Architecture* (ASPLOS'14 - a paper that came out from
the group at Princeton that my advisor was a student in, which was how I was
introduced to this idea and began working on this).

In my opinion, this Sharing-style architecture is more elegant compared to
things such as Core Fusion and MIT RAW, because it makes much more sense in a
viability stand point, because if we design hardware that requires people to put
more work into the compiler, I think the reception would be a lot less warm
compared to something that "just works".

As a matter of fact, the evaluation that I will include later shows that I
simulated a group of cores that runs programs compiled using the
riscv-gnu-elf-gcc toolchain.

### So, the core idea:
Say you have 20 cores, OS sees at time t 10 of them are idle, at such time, all
the OS needs to do is mark cores 0-9 to run process 1, and the hardware will
read these indices and share this instruction stream between these cores.

### The guiding question:
1. How do we build hardware that shares instructions between multiple, distinct
   cores (also called "slices") on the fly?
2. As you can imagine, this involves adding structures that allow for
   communication to coordinate sharing. Given that, single core performance will
drop, but overall with improved utilization, will this architecture be
justifiable?

For the next bits, I'm going to describe the architecture as I've (yes, and
Claude) have built it. I would consider it a bit primitive, given that I only
worked on this for 6 or 7 months.

![idealized slice](/blog/sharing-arch-images/idealized_slice.png)

![noc](/blog/sharing-arch-images/noc.png)

![fetch alignment](/blog/sharing-arch-images/fetch.png)

![rat alignment](/blog/sharing-arch-images/rat.png)

![lsu alignment](/blog/sharing-arch-images/lsu.png)

![rob alignment](/blog/sharing-arch-images/rob.png)

![branch alignment](/blog/sharing-arch-images/branch.png)

### Evaluation of our single-cycle prototype
![simplified eval](/blog/sharing-arch-images/eval.png)

### Pipelining
![pipelining](/blog/sharing-arch-images/pipelining.png)

### Speculative Branching
![speculative branching](/blog/sharing-arch-images/specbranch.png)

## Acknowledgements
![ack slide](/blog/sharing-arch-images/ack.png)

