---
title: "Hilightjs"
published: true
layout: post
disqus: yes
comments: no
description: Here’s an easy one, to add code hilighting to your jekyll site...
category: jekyll
tags: [javascript, blog, jekyll]
---

Let’s add code hilighting to your jekyll site.  You merely have to add a section like this to your head:

    <link rel="stylesheet" href="/assets/css/monokai_sublime.css">

you can pick from these [styles](https://github.com/isagalaev/highlight.js/tree/master/src/styles)

then add a block like this in your scripts:

      <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/highlight.min.js"></script>
      <script>
        $(document).ready(function(){
          hljs.initHighlighting();
        });
      </script>

now you have nice hilighting for your code snippets.

Of note it was used on this very page to hilight the above code blocks, you might be asking why not just use the jekyll plugin with something like this:

```
{% raw  %}
        {% highlight ruby %}
        def foo
          puts 'foo'
        end
        {% endhighlight %}
{% endraw  %}
```

well the same with the above block since it IS jekyll it trys to interpret that block natively, however if you wrap raw and endraw tags around it you can use it without jekyll interfering, like in this post about facebook:

[2015-11-28-facebook-comments-and-jekyll.md](https://raw.githubusercontent.com/joshuacox/joshuacox.github.io/master/_posts/2015-11-28-facebook-comments-and-jekyll.md)
