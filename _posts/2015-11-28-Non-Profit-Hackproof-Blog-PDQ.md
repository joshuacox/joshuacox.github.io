---
title: Non Profit Hackproof Blog PDQ
published: true
layout: post
disqus: yes
comments: no
category: jekyll
description: So I wanted to show a friend of mine that a static website can be a much better experience than starting out with a php/mysql based website.  
tags: [blog, nonprofit, jekyll]
redirect_from:
  - /jekyll/2015/11/28/Non-Profit-Hackproof-blog-PDQ.html
  - /2015/11/28/Non-Profit-Hackproof-blog-PDQ.html
---

So I wanted to show a friend of mine that a static website can be a much better experience than starting out with a php/mysql based website.  
To prove the point I started looking around for jekyll templates, and happened to search for nonprofit as well in the search term mix, lo and behold I come across this:
[free-nonprofit-starter-website](http://smartergiving.org/free-nonprofit-starter-website/)
they have a github repo here for it: [github.com/smartergiving/free-nonprofit-starter-website](https://github.com/smartergiving/free-nonprofit-starter-website)

The things I like it about it.  First and firemost it’s completely static and can be hosted for free, relying for the time being on external services (stripe and tinyletter).  So the next question became well can I theme it and add in some other external services like disqus and facebook comments?

I forked it and made an example site here: [bigspringfilm.github.io](http://bigspringfilm.github.io/) after some tooling around with fb comments I decided I needed to some serious evaluation before recommending a solutions to anyone.  So I dug into disqus...

By this time I was having so much fun with it all I forked again and began dismantling it inspecting the pieces and seeing how I could put them back together in interesting ways. I am now writing this very blog into that fork, mainly so I can continue to dissect and learn about running a jekyll blog so that I can help others to blog without having to rely on php and mysql.  And also just to document as I go in this blog, perhaps my musings will be useful to others.

So you can see the source code here: [https://github.com/joshuacox/joshuacox.github.io](https://github.com/joshuacox/joshuacox.github.io)
