---
title: Text Editors And Code
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - vim
  - git
  - ide
---

One universal question I can ask any programmer is, what text editor do you use?
Easily the most important tool in the programmers toolkit is the text
editor.   Nothing will make you faster and more powerful than knowing
how to quickly and efficiently edit text.  


### VIM
My favorite editor is VIM, it is very old, archaic,
has a very steep learning curve, 
but is extremely rewarding in terms of efficiency once
you utilize its hands on keyboard nature.
In that vein I have a site for you:
<http://vim-adventures.com/>

also
<http://www.openvim.com/>

lazy and just want to watch a video?
http://derekwyatt.org/vim/tutorials/
and
<http://vimcasts.org/>

Also, don't forget to try out simply `vimtutor` it is usually installed alongside vim in most distributions

#### Pimp my VIM

While this may be too much for you at the moment, I want to show endgame.
Here is how I have my vim configured, it is super pimped out with text
prediction, surround replacement alteration macros, advanced movement
(so you go anywhere without using a mouse), debugging without leaving
the text editor, everything you'd see in a full featured IDE
(Integrated Development Environment), but using vim.

<http://vim.spf13.com/>

### EMACS vs VIM

 Also, to round you out I'll introduce the competition. Emacs vs. Vim
 is a religious debate, there is no clear winner unless you are a
 devotee to one of them already ( I am a VIM racist ).  But I will say
 that Emacs can be just as powerful as vim.  Here is some humor:
<https://en.wikipedia.org/wiki/Editor_war#Humor>

my favorite is this one

```
Emacs is "a great operating system, lacking only a decent editor"
```

### IDEs 

 Wanting to try out a giant IDE?  Xcode on mac is not bad, you can also
 download the android studio for any platform:

<http://developer.android.com/sdk/index.html>

 it includes a pimped out copy of IntelliJ which is a nice environment:

<https://plugins.jetbrains.com/plugin/?idea&pluginId=631>

 and android studio used to be based on eclipse:

<https://eclipse.org/downloads/>

which is also free.

Notice you can get eclipse to behave like vim:
<http://vrapper.sourceforge.net/home/>
 
and vim to behave like eclipse:
<http://eclim.org/>
 
 Try them all out
 and get familiar with the differences, but be sure and do it low tech
 style as well so you know the meat of what's going on (python given as an example)

```
 vim helloworld.py
```

 and write at least one script that way (hint to run it afterwards just
 do `python helloworld.py`), you don't need all that GUI stuff, and can
 actually hinder you much like crutches must be taken away at some
 point before the person can 'run'.

## GIT

Do you get git?  If your text editor is one of the most important
tools of programming, then how you save your text files is just as
important.  Git 'saves' a snapshot of a directory, meaning that it
'saves' each and every file in a directory at a point in time.

I have a tutorial here:
<http://joshuacox.github.io/cli-Intro-to-Git/>

more resources:
<https://try.github.io/levels/1/challenges/1>

<https://www.codecademy.com/learn/learn-git>

<https://help.github.com/articles/good-resources-for-learning-git-and-github/>

as always let me know when you have questions, send code my way, I'll
help debug!

Hint: a good way to send me code is to put up a repo in github and send me a link, and I'll send you pull requests of changes.
