---
title: containerization2kubernetes
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
photo_url: /img/thumbs/containers.jpg
---

![](/img/dockerkub.jpg)


# Containerization

Containerization has been a crucial part of the Linux operating system for several years. The concept was first introduced by 
FreeBSD in the late 90s, but it wasn't until Linux distributions like Docker and LXC started gaining popularity that containers 
became an essential aspect of the platform.

Containers allow developers to package software applications with all their dependencies into a single container that can run on 
any Linux machine. This makes it easier for developers to test and deploy apps quickly without worrying about compatibility issues.

The history of containerization in Linux dates back to 2013 when Docker was introduced as an open-source project. The platform 
allowed developers to easily build, ship and run their applications anywhere with consistent performance. Since then, it has become
one of the most popular ways to deploy containers on Linux systems.

In addition to Docker, other containerization technologies like LXC (Linux Containers) and LXD (Linux Container Daemon) have also 
gained popularity among developers. LXC allows developers to run multiple isolated Linux environments on a single host machine, 
while LXD is a more recent addition that offers better performance than LXC.

Overall, containerization has revolutionized the way developers build and deploy applications on Linux systems. It has made it 
easier for them to create scalable and fault-tolerant software solutions that can run seamlessly across different platforms.

### The transition to kubernetes

Kubernetes is an open-source platform for managing containerized applications. It was developed by Google and donated to the Cloud 
Native Computing Foundation (CNCF) in 2015. Since then, it has become one of the most popular container orchestration platforms for
deploying and scaling containerized applications.

Kubernetes is important because it enables developers to easily manage and scale containerized applications across multiple 
servers. With Kubernetes, developers can define how their containers should be deployed and managed in a cluster, ensuring that 
they are always running in the most efficient manner possible.

One of the key benefits of using Kubernetes is its ability to automatically handle issues such as failed nodes or pods. This means 
that if a node or pod fails, Kubernetes will automatically move the workload to another healthy node without any intervention 
required from the developer.

Another benefit of using Kubernetes is its support for multiple container runtime technologies like Docker and rkt. This allows 
developers to choose the best container runtime technology based on their needs and requirements.

In summary, Kubernetes is an essential component of modern application development because it enables developers to easily manage 
and scale containerized applications across multiple servers. It provides a high level of automation and scalability that is 
critical for building robust and reliable software solutions.

