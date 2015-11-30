---
title: "Icinga2 Docker"
published: true
layout: post
disqus: yes
fbcomments: no
category: docker
photo_url: /img/thumbs/icinga_logo.jpg
tags: [ansible, docker, icinga2]
---

![](/img/icinga_logo.jpg)

Today we’re going to be experimenting with adding Icinga2 to our Monitoring setup.  There’s an official icinga blog post here [icinga.org/2015/06/03/docker-docker-docker/](https://www.icinga.org/2015/06/03/docker-docker-docker/)

Github repo here:
[github.com/Icinga/docker-icinga2](https://github.com/Icinga/docker-icinga2)

I went ahead and made an associated ansible orchestration script here:
[http://joshuacox.github.io/ancinga](http://joshuacox.github.io/ancinga)

you should be able to clone that repo, add the necessary lines to `/etc/ansible/hosts` and `make server` 

Let me know if anyone experiences otherwise, or just wants a better explanation of what’s going on
