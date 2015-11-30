---
title: Facebook Comments and Jekyll
published: true
layout: post
disqus: no
fbcomments: yes
category: jekyll
description: Using jekyll with Facebook Comments was not quite as easy as disqus, but.....
tags: [facebook, commenting, blog, jekyll]
---

Using jekyll with Facebook Comments was not quite as easy as disqus, but in the end you merely need to add some lines to your `_layouts/post.html` along with a few other things, here’s what I did:

### Facebook Comments account and creation of your sites commenting

First you’ll need to get a Facebook Developer account:
[developer.facebook.com](https://developer.facebook.com/)

then add your site as a new app in Facebook Comments:

[developers.facebook.com/docs/plugins/comments](https://developers.facebook.com/docs/plugins/comments)

once you have created your app you should be able to locate it in  [developers.facebook.com/apps](https://developers.facebook.com/apps/) once you have located it click on it to go to it’s admin panel, then click “settings”, in here you’ll want to make sure your domain is added to the App Domains, and then click on the “Status and Review” page, in there you can make your app publicly accessible

### Jekyll Configuration

Now then when you click the “Get Code” button on the above doc page it will give you two blocks of code, the first of which I make into an include which you can see the one for this blog here:

{% raw  %}
      <div id="fb-root"></div>
      <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=978128892233940";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));</script>
{% endraw  %}
[facebook-init.html](https://github.com/joshuacox/joshuacox.github.io/blob/master/_includes/facebook-init.html)

Then add this somewhere after your content block  (where YOUR_SITE_NAME is the full domain name of your site):
{% raw  %}
      {% include facebook-like.html %}
      {% if page.fbcomments %}
        <hr/>
        <h4>Comments</h4>
        <div class="fb-comments" data-href="http://YOUR_SITE_NAME{{ page.url }}" data-colorscheme="dark" data-num-posts="4" data-width="706"></div>
      {% endif %}
{% endraw  %}

Add a meta property with your app_id:

    <meta property=”fb:app_id”       content=”978128892233940” />

Now make a post with this line in the YAML front matter:

      fbcomments: yes

and you should be good to go.  Testing at the bottom of this post in fact

you can see my current post.html [here](https://github.com/joshuacox/joshuacox.github.io/blob/master/_layouts/post.html)
