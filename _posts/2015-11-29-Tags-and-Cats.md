---
title: Tags and Cats
published: true
layout: post
disqus: yes
fbcomments: no
description: Let's make an index page for both our categories and tags for our jekyll blog
category: jekyll
tags: 
  - jekyll
---

Let's make an index page for both our categories and tags for our jekyll blog

First you will need to properly tag and categorize your posts, to do this add lines like these in your front matter:

      category: jekyll
      tags: 
        - jekyll


Then for a category cloud you'll need to add something like this to a file presumably in `categories/index.html` 

{% raw  %}
        <ul class="category-cloud">
        {% for category in site.categories %}
            <a style="font-size: {{ category | last | size | times: 100 | divided_by: site.categories.size | plus: 70  }}%" href="#{{ category | first | slugize }}">
            &nbsp  {{ category | first | capitalize }} &nbsp
            </a>
        {% endfor %}
        </ul>
{% endraw  %}


then for a list of the categories you'll need to add some lines like this:

{% raw  %}
      <h2>List</h2>
      <div id="category-list">
      {% for category in site.categories %}
        <div class="category-group">
          {% capture category_name %}{{ category | first }}{% endcapture %}
          <h3 id="#{{ category_name | slugize }}">{{ category_name | capitalize }} /</h3>
          <a name="{{ category_name | slugize }}"></a>
          {% for post in site.categories[category_name] %}
          <article class="category-item">
            <h5>- <a href="{{ root_url }}{{ post.url }}">{{post.title}}</a></h5>
          </article>
          {% endfor %}
        </div>
      {% endfor %}
      </div>
{% endraw  %}

Then for a tags cloud you'll need to add something like this to a file presumably in `tags/index.html` 

{% raw  %}
      <ul class="tag-cloud">
      {% for tag in site.tags %}
          <a style="font-size: {{ tag | last | size | times: 100 | divided_by: site.tags.size | plus: 70  }}%" href="#{{ tag | first | slugize }}">
          &nbsp {{ tag | first | capitalize }} &nbsp
          </a>
      {% endfor %}
      </ul>
{% endraw  %}

then for a list of the tags you'll need to add some lines like this:

{% raw  %}
      <div id="tags">
      {% for tag in site.tags %}
        <div class="tag-group">
          {% capture tag_name %}{{ tag | first }}{% endcapture %}
          <h3 id="#{{ tag_name | slugize }}">{{ tag_name | capitalize }} /</h3>
          <a name="{{ tag_name | slugize }}"></a>
          {% for post in site.tags[tag_name] %}
          <article class="tag-item">
            <h5>- <a href="{{ root_url }}{{ post.url }}">{{post.title}}</a></h5>
          </article>
          {% endfor %}
        </div>
      {% endfor %}
      </div>
{% endraw  %}

You should now have two pages that nicely index your tags and categories.
