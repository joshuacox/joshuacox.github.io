---
title: Blog Like A Hacker with Tmuxinator + SpaceVIM + Jekyll 
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
photo_url: /img/vim_drill_small.jpeg
---

![](/img/vim_drill_small.jpeg)

This is an ode to Tom Preston Werner's incecption [post](http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html) to [Jekyll](https://jekyllrb.com).
While I am very impressed with what [prose.io](https://prose.io/) is doing for people who want 'simple', I on the other hand have put in my time
steep learning curves of vim, bash, git, screen, tmux, byobu are behind me. I have these skills so I want to use them, right?
I don't have time to click buttons and wait on submit times, my text editor is more than an extension of my body it exudes my essence
and is intrinsically part of my personality.  Ok, enough ranting I should have driven off all but the resilient.  Let's get started.

If you are here then I most likely either don't need to tell you the virtues of VIM or you're an EMACS fan looking to troll.
In which case, I have one thing to tell you, `EMACS is a fantastic Operating System, that is lacking a decent text editor`,  zing!
And we are gonna flat out ignore people who pay for their text editor.  Ok, everyone gone?

Let me hook the rest of you up with the secret to destroy all other editors and IDEs:

## SpaceVIM

![](/img/thumbs/spacevim.png)

[spacevim.org/](http://spacevim.org/)

You can install SpaceVIM with a curl oneliner::

```
curl -sLf https://spacevim.org/install.sh | bash
```

You will then have the most advanced hacker text editor on the planet. See the [docs](https://spacevim.org/documentation/).

## Tmux

Now let's use it like a proper hacker, and that is inside a [Tmux](https://github.com/tmux/tmux/wiki) session.

Now, to be fair, we should probably mention [screen](https://linuxize.com/post/how-to-use-linux-screen/), which is how people used to multiplex terminal sessions, until tmux came along.  Which about a decade ago eclipsed screen in development momentum, even this [comment](https://superuser.com/a/236160/291115) has a decade of edits!  Go judge for yourself though, the source code for [tmux](https://github.com/tmux/tmux) and [screen](https://git.savannah.gnu.org/cgit/screen.git) are there for your inspection.

Funny story, I used to be a big screen user over a decade ago, and I started using [byobu](https://linuxize.com/post/how-to-use-linux-screen/), and one day on my system I realized I didn't even have screen installed and yet byobu worked just fine.  Long story short I found out I was actually running tmux and not screen in the background, and I had no clue!  Suffice it to say because of byobu I've been using tmux for over a decade using screen's escape sequence `ctrl-a`, and all seems to be good.

This is because byobu wraps tmux very well and changes the leader back to `ctrl-a` (where tmux defaults to `ctrl-b`), there are noted other differences like `ctrl-b x` kills a session in tmux, but byobu remaps this back to the much more sane and harder to hit by mistake `ctrl-a k`.

Which brings me to the great ruby project [Tmuxinator](https://github.com/tmuxinator/tmuxinator) to manage and create tmux sessions easily using yaml files!

After installing [Tmuxinator](https://github.com/tmuxinator/tmuxinator), let's start by making a new tmuxinator session called "blog" --> `tmuxinator new blog`

Which will create a new file --> `~/.config/tmuxinator/blog.yml`, and then open it up in your chosen `$EDITOR`, which whould be set to `vim` in order to use our new spacevim setup.

To utilize byobu, I set the `tmux_command` with:

```
tmux_command: byobu
```

This starts my sessions with `byobu`, instead of `tmux`.

Here is a bare minimum example that I am using with this blog:

```
name: blog
root: ~/git/joshuacox.github.io/
tmux_command: byobu
windows:
  - jekyll:
      layout: main-vertical
      panes:
        - vim _drafts/*
        - jekyll s --drafts
```

So long as you have the shell [completion](https://github.com/tmuxinator/tmuxinator#completion), then you can now use the short hand:

```
mux start blog
```

And you'll have a custom tmux session dedicated to your blog.

Now let's experiment with your new pimped out spacevim editor, first I recommend you turn on the [html layer](https://spacevim.org/layers/lang/html/), the [javascript layer](https://spacevim.org/layers/lang/javascript/), and the [markdown layer](https://spacevim.org/layers/lang/markdown/), you can see all the [available layers here](https://spacevim.org/layers/).

And the general Spacevim [docs](https://spacevim.org/documentation/).
