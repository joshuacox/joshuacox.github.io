---
title: Tmuxinator VIM Jekyll Blog Like A Hacker
published: true
layout: post
disqus: yes
fbcomments: no
category: jekyll
tags: 
  - linux
  - jekyll
  - vim
  - spacevim
  - tmuxinator
  - tmux
  - byobu
  - blog
photo_url: /img/thumbs/spacevim.png
---

![](/img/vim_drill_small.jpeg)

This is an ode to Tom Preston Werner's incecption [post](http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html) to Jekyll.
While I am very impressed with what prose.io is doing for people who want 'simple', I on the other hand have put in my time
steep learning curves of vim, bash, git, screen, tmux, byobu are behind me. I have these skills so I want to use them, right?
I don't have time to click buttons and wait on submit times, my text editor is more than an extension of my body it exudes my essence
and is intrinsically part of my personality.  Ok, enough ranting I should have driven off all but the resilient.  Let's get started.

If you're here I most likely either don't need to tell you the virtues of VIM or you're an EMACS fan looking to troll.  
In which case I have one thing to tell you "EMACS is a fantastic Operating System, that is lacking a decent text editor",  zing!  
And we're gonna flat out ignore people who pay for their text editor.  Ok, everyone gone?  
Let me hook the rest of you up with the secret to destroy all other editors and IDEs:

[spacevim.org/](http://spacevim.org/)

If you install that with simply

```
curl -sLf https://spacevim.org/install.sh | bash
```

You will then have the most advanced hacker text editor on the planet. See the [docs](https://spacevim.org/documentation/).

Now let's use it like a proper hacker, and that is inside a [Tmux](https://github.com/tmux/tmux/wiki) session.

Now, to be fair, we should probably mention [screen](https://linuxize.com/post/how-to-use-linux-screen/), which is how people used to multiplex terminal sessions, until tmux came along.

Funny story, I used to be a big screen user over a decade ago, and I started using [byobu](https://linuxize.com/post/how-to-use-linux-screen/), and one day on my system I realized I didn't even have screen installed and yet byobu worked just fine.  Long story short I found out I was actually running tmux and not screen in the background, and I had not clue!

This is because byobu wraps tmux very well and changes the leader back to `ctrl-a` (where tmux defaults to `ctrl-b`), there are noted other differences like `ctrl-b x` kills a session in tmux, but byobu remaps this back to the much more sane and harder to hit by mistake `ctrl-a k`.

Which brings me to the great ruby project [Tmuxinator](https://github.com/tmuxinator/tmuxinator) to manage and create tmux sessions easily! 

In these, I usually set them with:

```
tmux_command: byobu
```

This starts my sessions with `byobu`, instead of `tmux`.

