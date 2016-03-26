---
title: Convert Wordpress to static PDQ
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - wordpress
---

Ok, today let's kill off a wordpress site before it gets hacked and leave up a static unhackable version of the site,
note that using this method you can archive any publicly available site, be it wordpress, joomla, drupal, some proprietary
CMS that you have grown to hate, whatever, whenever.

There are a few ways to do this, the simplest being `wget -m`, e.g. let's 'mirror' example.com

```
 wget -m example.com
```

You now have a folder `example.com` with a static version of your site that is nigh invulnerable to hackers
and you can leave up for years without worrying about updating or maintenance.

#### Templatize

Now that we have a static version how do we make changes without having to rewrite every page?  We convert the static site into templates.
If you'll look at bokbot.com/index.html you'll notice we already have the base structure for our site.

So let's fork this starter project:

http://smartergiving.org/free-nonprofit-starter-website/

go here to it's github home page:

https://github.com/smartergiving/free-nonprofit-starter-website

click 'fork' in the upper right hand corner (you'll need a free github account for this)

then you'll notice this file:

https://github.com/smartergiving/free-nonprofit-starter-website/blob/master/_layouts/default.html

where you'll see statements like this:

{% raw  %}
   {% include head.html %}
{% endraw  %}

which points to a file called `head.html` in the `_includes` directory here:

https://github.com/smartergiving/free-nonprofit-starter-website/tree/master/_includes

Alter that file to include the 'head' part of your theme (navbar and any other elements up top before the body)

Then do the same for the footer:

https://github.com/smartergiving/free-nonprofit-starter-website/blob/master/_includes/footer.html

And you are done with theming!  It could not be simpler.

#### Migrate old content

It may be easier to just migrate your content with one of the many migration utilities here:

https://import.jekyllrb.com/docs/home/

You'll notice on the right many links to "importers" including wordpress:

https://import.jekyllrb.com/docs/home/

As stated on that page: This importer only converts your posts and creates YAML front-matter. It does not import any layouts, styling, or external files (images, CSS, etc.).

So you'll still need to import your theme as above

##### Why?

I'm going to go on record here and state, IF you are not a PHP programmer, and you are not a MySQL database admin,
and you do not have the money to hire someone full-time to be those positions, then you have no business having a 
website made with PHP and MySQL.  This includes wordpress, joomla, drupal, and just about any CMS you can think of.
This stuff is not trivial, and security updates should be taken seriously.  It is much to your advantage to eliminate 
your exposure to programming languages if you are not a progammer.

So do yourself a favor and hire someone to create a static site for you generated from templates (like Jekyll or Ghost),
and you will not have to deal with hackers taking advantage of your site.
You'll not only spend less money and time initially, 
the savings over the long term will be substantial

#### Dynamic elements 

Ok, what does a person need on their website that dynamic things like
PHP and wordpress provide?  And do we have some alternatives?

###### commenting?  check!

 discource (open source DIY solution):

 http://www.discourse.org/

 or disqus:

 http://joshuacox.github.io/jekyll/2015/11/27/disqus-and-jekyll/

 or facebook:

 http://joshuacox.github.io/jekyll/2015/11/28/facebook-comments-and-jekyll/

 Of the three I can recommend both discource and disqus, facebook I found to be problematic on nearly half the browsers
 I tested on, and since disqus will let you login with your facebook account it is moot

###### sharing with social media? check!

 http://joshuacox.github.io/jekyll/2015/12/01/Super-Simple-Sharing-Buttons/

###### links, images, headings, etc:

 http://joshuacox.github.io/jekyll/2015/12/02/0-to-60-in-Markdown/

 Notice any of this can be done on ANY static template generator site,
 this is not exclusive to jekyll.  I just use it here as an example.

###### Ecommerce

Jekyll-Store:

http://www.jekyll-store.com/

or with amazon:

http://joshuacox.github.io/amazon/

###### Contact form

and a contact form that connects to tinyletter:

http://joshuacox.github.io/about/#contact

or some more options
formkeep:

https://formkeep.com/guides/how-to-make-a-contact-form-in-jekyll?utm_source=github&utm_medium=jekyll-docs&utm_campaign=contact-form-jekyll

simpleform:

https://getsimpleform.com/

http://sebastien.saunier.me/blog/2014/04/15/you-do-not-need-a-database-for-your-contact-form.html

who recommends formspree:

https://formspree.io/

and wufoo:

http://www.wufoo.com/

stackoverflow question:

http://stackoverflow.com/questions/17983972/github-contact-form-with-jekyll

https://coderwall.com/p/8lq1ba/how-to-create-a-contact-form-for-a-github-pages-served-jekyll-website

### Jekyll and the future

You may know that:

https://www.healthcare.gov/

was built using jekyll. But this is ancient history now, the leader of jekyll has left to do
other things and why continue to use Jekyll?  Because the principles
are sound, you can build a site in Jekyll today and it can stay up for
years without maintenance or updates.

So whereto next?

There are tons of great projects springing up based on these principles.

"But it's static so that means it's hard", bullshit.  It's easier than
dealing with a wordpress theme, and you can be up and rolling in three
minutes if you follow this:

http://jekyllbootstrap.com/

and that guy went on to build ruhoh:

http://ruhoh.com/

which is very friendly and easy to use.

or you can use ghost:

https://ghost.org/

there are hundreds of new platforms out there now.  And this does not
mean you cannot have dynamic things in them, as I've already shown all
the normal elements like commenting can be had easily.

If you need something custom, fire up a nodejs server, or sinatra, or
ruby on rails, and you can do amazingly complex stuff like serve up a
MMORPG through browser experience.

You can even fire up a drupal instance and use it as a database
backend API for your static site.

https://groups.drupal.org/headless-drupal

which is how I envision some really cool stuff happening with D3 as a visualizer

https://d3js.org/

So the future is rich with options, get rid of wordpress now, stick to simple templates that generate static content
and pull in the dynamic things you need using javascript and inhouse solutions or use many of the great truly free
to use services like disqus and let them handle the hackers so you can get back to creating content.
