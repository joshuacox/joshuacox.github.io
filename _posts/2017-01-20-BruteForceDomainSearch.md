---
title: BruteForceDomainSearch
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - linux
  - perl
  - docker
  - make
---

Brute forcing your next domain name

[Brute Force Domain Search](http://thalhalla.github.io/BruteForceDomainSearch/)
- Is a bit of perl to help you find open domain names that are available
for purchase.

Anytime you go to starting a business or pretty much any other entity,
the first thing you ask yourself is what to name it.  And this more
often than not leads to the question 'Is this name available as a
domain?'...

At which point someone inevitably looks up the domain in question and
says "It's already taken", and the search continues.

To alleviate this problem I thought I'd invert the process and brute
force determine which domains were available.

Of note this is "brute force" and is likely to get you banned ten ways from Sunday!  Do not ever run this script as it will destroy your computer and set fire to whatever dwelling you currently inhabit!
You've been warned (I've added some throttling and a block of public DNS servers but this is still a brute force script)

### Example Usage

Given you have perl properly installed (and it exists at
`/usr/bin/perl`, and you are not on arch linux where everything is too
new, then you you can do this

`bruteforcedomainsearch.pl [--startingNumber 6 --finishingNumber 8 --throttle 10 --sleepthrottle 5 --tld '.com' -vvvvvvvvvv]`

Not much to see here, does what it says on the tin , e.g.
that will hunt down all available 6, 7, and 8 letter domains available
and limit you to ten requests with each resolver before sleeping for five seconds  (roundabouts it was a simple throttle nothing fancy)
it will start dumping out available domain names into STDOUT and /tmp/domlog

#### Detailed Eplanations of the Arguments

`--startingNumber`

* The number of letters we will start iterating from (i.e. 1 = a.com, 5 = aaaaa.com)

`--finishingNumber`

* The number of letters we will finish iterating at (i.e. 1 = a.com, 5 = aaaaa.com)

`--throttle`

* This is the number of loops to hit the Nameservers with before sleeping

`--sleepthrottle`

* This is the number of seconds to sleep once we hit the throttle

`--tld`

* This is the Top Level Domain (e.g. '.com') to hit the Nameservers with before sleeping

`-v`

* verbosity (notice you can stack more v's at the end to get more verbosity)

`-vvvvvvvvv`

* Really verbose


### Makefile

I use the `Makefile` to keep my usage a bit more consistent

`make full`

* full rundown from 1 to 10 letters

`make xi`

* will do the same as above and install any dependencies using `lib::xi`

`make reqs`

* will install cpanminus and then `lib::xi` in debian

### Docker

The `Makefile` will also net you some docker actions as well

Most of this section works by virtue of the `--cidfile="cid"` option to
the `docker run` command

`tmp/domlog`

* Using the Makefile to create the docker container will result in a `tmp` directory here, which will contain the resulting `/tmp/domlog` from inside the container, so no need to go into the container to retrieve it

`make a`

* A macro which builds a docker image locally, runs it and displays the logs

`make build`

* builds a docker image locally

`make log`

* shows logs of the running docker

`make run`

* runs a docker image locally

`make clean`

* kills and removes the docker container


For the latest useage, see the github page:
[Brute Force Domain Search](http://thalhalla.github.io/BruteForceDomainSearch/)

For questions, or other help, please post an [issue](http://thalhalla.github.io/BruteForceDomainSearch/issues)
