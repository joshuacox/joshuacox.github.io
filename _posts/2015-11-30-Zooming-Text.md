---
title: Zooming Text just like JessFraz.com
published: true
layout: post
disqus: yes
fbcomments: no
description: Let’s add the zooming text up top for eye catching animation on our main index page
category: jekyll
tags: 
  - javascript
photo_url: /img/jessiefraz.jpg
---

![](/img/jessiefraz.jpg)

Ok, I just loved the zooming text Jessie Frazelle had added to her main [site](https://jessfraz.com/)

First let’s look at how her javascript is working, notice she creates a function that adds and removes classes “slideInDown” and “slideOutUp” on elements with the class “favthing”

{% highlight javascript %}
      var sleep = function(ms, callback) {
              setTimeout(function() {
                  callback()
              }, ms)
          },
          favthings = ["golang", "bash scripting", 'creating <a href="http://en.wikipedia.org/wiki/Text-based_user_interface" target="_blank">TUI\'s</a>', "python", "javascript", "tomfollery in R", "docker"],
          removeClass = function(el, className) {
              el.classList ? el.classList.remove(className) : el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ")
          },
          addClass = function(el, className) {
              el.classList ? el.classList.add(className) : el.className += " " + className
          },
          i = 0,
          nextThing = function(thing) {
              i < favthings.length - 1 ? i++ : i = 0, removeClass(thing, "slideInDown"), addClass(thing, "slideOutUp"), sleep(700, function() {
                  thing.innerHTML = favthings[i], removeClass(thing, "slideOutUp"), addClass(thing, "slideInDown")
              })
          };
      document.addEventListener("DOMContentLoaded", function() {
          var thing = document.querySelectorAll(".favthing")[0];
          setTimeout(function() {
              nextThing(thing)
          }, 1e3), setInterval(function() {
              nextThing(thing)
          }, 4e3)
      });
{% endhighlight %}

Ok, so let’s hijack all of this and make it do our own thing first I am going to duplicate her favthings block and replace favthing with titlething, then in the titlethings array I’m going to add in a few of my own little phrases

{% highlight javascript %}
          titlethings = ["Console Cowboy", "Serial Samurai", "Parallel Prognosticator", "Diabolical Diagnostician", "Embedded Systems Engineer", "Wetware Whisperer", "Meta Mercenary", "Neural-Network Ninja", "SysAdmin", "Linux Geek", "Techromancer"],
          removeTitleClass = function(el, className) {
              el.classList ? el.classList.remove(className) : el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ")
          },
          addTitleClass = function(el, className) {
              el.classList ? el.classList.add(className) : el.className += " " + className
          },
          i = 0,
          nextTitleThing = function(titlething) {
              i < titlethings.length - 1 ? i++ : i = 0, removeClass(titlething, "fadeInLeftBig"), addClass(titlething, "fadeOutRightBig"), sleep(700, function() {
                  titlething.innerHTML = titlethings[i], removeClass(titlething, "fadeOutRightBig"), addClass(titlething, "fadeInLeftBig")
              })
          };
{% endhighlight %}

Now add another EventListener that will start the animations once the page loads

{% highlight javascript %}
      document.addEventListener("DOMContentLoaded", function() {
          var titlething = document.querySelectorAll(".titlething")[0];
          setTimeout(function() {
              nextTitleThing(titlething)
          }, 1e3), setInterval(function() {
              nextTitleThing(titlething)
          }, 4e3)
      });
{% endhighlight %}

Now add a span where ever you like and the javascript will start animating it, e.g.

    <h3><span class="animated titlething">{{ site.org_summary }}</span></h3>

My complete changes to the javascript:

{% highlight javascript %}
      /*
      portfolio - v - 2014-06-28
      Jess Frazelle's Portfolio
      Lovingly coded by Jess Frazelle  - http://frazelledazzell.com
      */
      var sleep = function(ms, callback) {
              setTimeout(function() {
                  callback()
              }, ms)
          },
          favthings = ["Debian Linux", "Gentoo Linux","Arch Linux", "Ubuntu Linux", "Linux Mint", "golang", "bash scripting", 'creating <a href="http://en.wikipedia.org/wiki/Text-based_user_interface" target="_blank">TUI\'s</a>', "python", "javascript", "tomfollery in R", "docker"],
          removeClass = function(el, className) {
              el.classList ? el.classList.remove(className) : el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ")
          },
          addClass = function(el, className) {
              el.classList ? el.classList.add(className) : el.className += " " + className
          },
          i = 0,
          nextThing = function(thing) {
              i < favthings.length - 1 ? i++ : i = 0, removeClass(thing, "fadeInLeftBig"), addClass(thing, "fadeOutRightBig"), sleep(700, function() {
                  thing.innerHTML = favthings[i], removeClass(thing, "fadeOutRightBig"), addClass(thing, "fadeInLeftBig")
              })
          };
          titlethings = ["Console Cowboy", "Serial Samurai", "Parallel Prognosticator", "Diabolical Diagnostician", "Embedded Systems Engineer", "Wetware Whisperer", "Meta Mercenary", "Neural-Network Ninja", "SysAdmin", "Linux Geek", "Techromancer"],
          removeTitleClass = function(el, className) {
              el.classList ? el.classList.remove(className) : el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ")
          },
          addTitleClass = function(el, className) {
              el.classList ? el.classList.add(className) : el.className += " " + className
          },
          i = 0,
          nextTitleThing = function(titlething) {
              i < titlethings.length - 1 ? i++ : i = 0, removeClass(titlething, "fadeInLeftBig"), addClass(titlething, "fadeOutRightBig"), sleep(700, function() {
                  titlething.innerHTML = titlethings[i], removeClass(titlething, "fadeOutRightBig"), addClass(titlething, "fadeInLeftBig")
              })
          };
      document.addEventListener("DOMContentLoaded", function() {
          var titlething = document.querySelectorAll(".titlething")[0];
          setTimeout(function() {
              nextTitleThing(titlething)
          }, 1e3), setInterval(function() {
              nextTitleThing(titlething)
          }, 4e3)
      });
      document.addEventListener("DOMContentLoaded", function() {
          var thing = document.querySelectorAll(".favthing")[0];
          setTimeout(function() {
              nextThing(thing)
          }, 1e3), setInterval(function() {
              nextThing(thing)
          }, 4e3)
      });
{% endhighlight %}

enjoy!
