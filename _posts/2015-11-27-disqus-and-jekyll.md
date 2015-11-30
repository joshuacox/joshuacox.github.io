---
title: Disqus and Jekyll
published: true
layout: post
disqus: yes
fbcomments: no
category: jekyll
description: Using jekyll with disqus is quite easy, you merely need to add some lines to your `_layouts/post.html`
tags: [disqus, jekyll, commenting, blog]
---

Using jekyll with disqus is quite easy, you merely need to add some lines to your `_layouts/post.html`, here’s what I did:

### Disqus account and creation of your sites commenting

First you’ll need to get a disqus account 

https://disqus.com/

then add your site to disqus:

https://disqus.com/admin/create/

Along the way you will come to the install section the URL will similar to ‘YOUR_DISQUS_URL.disqus.com/admin/settings/install/’ choose the “Universal code” In the next section I’ll show you how to conditionally add this commenting feature to your post pages using the code they give you on this installation page.

### Jekyll Configuration

Next add this right after your body tag (where DISQUS_SITE_NAME is the name you gave disqus for this particular site):

{% highlight ruby %}
{% endhighlight %}
{% raw  %}
        {% if page.disqus %}
          <script id="dsq-count-scr" src="//DISQUS_SITE_NAME.disqus.com/count.js" async></script>
        {% endif %}
{% endraw  %}


Then add this somewhere after your content block  (where DISQUS_SITE_NAME is the name you gave disqus for this particular site, and DISQUS_URL is the actual URL for your site):
{% raw  %}
      {% if page.disqus %}
        <div id="disqus_thread"></div>
        <script>
        /**
        * RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        * LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
        */
        var disqus_config = function () {
        this.page.url = "http://DISQUS_URL{{ page.url }}"; // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = "DISQUS_URL{{ page.url }}"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');

        s.src = '//DISQUS_SITE_NAME.disqus.com/embed.js';

        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        })();
        </script>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
      {% endif %}
{% endraw  %}

Now make a post with this line in the YAML front matter:

      disqus: yes

and you should be good to go.  Testing at the bottom of this post in fact

you can see my current post.html [here](https://github.com/joshuacox/joshuacox.github.io/blob/master/_layouts/post.html)
