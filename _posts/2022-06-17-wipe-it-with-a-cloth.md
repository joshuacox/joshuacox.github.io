---
title: Wipe it with a cloth
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - storage
photo_url: /img/thumbs/cloth_or_something3.jpg
---

![](/img/thumbs/cloth_or_something3.jpg)

  [Bleachbit](https://www.bleachbit.org/cloth-or-something) became famous when Hillary used it on her machines:

> August 2015 Hillary Clinton was asked, "Did you wipe your email server?" 
> and she evasively replied, "Like with a cloth or something?" 
> A year later we found out that "cloth" was BleachBit, 
> a software application that deletes information 
> "so even God can't read it," as Congressman Trey Gowdy announced August 2016.

Now, you can download [bleachbit](https://www.bleachbit.org/download) for free, but we can also do the same thing given some of the basic tools available in every linux distro. Let's explore some of this.

# Identity your disks

First let's identify the disk in question. If you have the convenience of having already popped the drive in question out of whatever machine it was in, 
then let's connect the device to our local machine for erasure using a device like [this](https://amzn.to/3xYCcDS).

Before we do connect we can take a snapshot of our current drive state with blkid like this:

```
sudo blkid | sort > /tmp/blkid1
```

I added the sort in there if anything gets out of order.
Then you can connect the device and capture a second time then diff it against the first one:


```
sudo blkid | sort > /tmp/blkid2
diff /tmp/blkid1 /tmp/blkid2
```

e.g.

```
diff sort1 sort2
31a32
> /dev/sdd1: LABEL_FATBOOT="XZ" LABEL="XZ" UUID="81B7-D64B" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="d6969665-01"
```

In this case the drive in question is `/dev/sdd`.

You will, also, see entries in `dmesg` relating to the drive in question.

```
$ sudo dmesg|grep -A18 'new high-speed'
[47775.756895] usb 1-11.2: new high-speed USB device number 12 using xhci_hcd
[47775.897140] usb 1-11.2: New USB device found, idVendor=abcd, idProduct=1234, bcdDevice= 1.00
[47775.897144] usb 1-11.2: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[47775.897145] usb 1-11.2: Product: UDisk
[47775.897146] usb 1-11.2: Manufacturer: General
[47775.897147] usb 1-11.2: SerialNumber: Љ
[47775.905101] usb-storage 1-11.2:1.0: USB Mass Storage device detected
[47775.905170] scsi host6: usb-storage 1-11.2:1.0
[47775.905204] usbcore: registered new interface driver usb-storage
[47775.907564] usbcore: registered new interface driver uas
[47776.917294] scsi 6:0:0:0: Direct-Access     General  UDisk            5.00 PQ: 0 ANSI: 2
[47776.917493] sd 6:0:0:0: Attached scsi generic sg3 type 0
[47776.917687] sd 6:0:0:0: [sdd] 7866368 512-byte logical blocks: (4.03 GB/3.75 GiB)
[47776.917807] sd 6:0:0:0: [sdd] Write Protect is off
[47776.917809] sd 6:0:0:0: [sdd] Mode Sense: 0b 00 00 08
[47776.917932] sd 6:0:0:0: [sdd] No Caching mode page found
[47776.917934] sd 6:0:0:0: [sdd] Assuming drive cache: write through
[47776.919350]  sdd: sdd1
[47776.919934] sd 6:0:0:0: [sdd] Attached SCSI removable disk
```

We can use a few linux utilities to get more info on the device:

#### fdisk

With fdisk the `Disk model:` line can be very useful in identifying a disk.

```
$ sudo fdisk -l /dev/sdd
Disk /dev/sdd: 3.75 GiB, 4027580416 bytes, 7866368 sectors
Disk model: UDisk           
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xd6969665

Device     Boot Start     End Sectors  Size Id Type
/dev/sdd1        2048 7866367 7864320  3.8G 83 Linux
```

#### blkid

```
$ sudo blkid /dev/sdd*
/dev/sdd: PTUUID="d6969665" PTTYPE="dos"
/dev/sdd1: LABEL_FATBOOT="XZ" LABEL="XZ" UUID="81B7-D64B" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="d6969665-01"
```

#### lsblkd

```
$ sudo lsblk /dev/sdd 
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sdd      8:48   1  3.8G  0 disk 
└─sdd1   8:49   1  3.8G  0 part 
```

Now, if you're dealing with a remote machine you won't be able to easily plug the device in like this and we can't use diff easily to identify the device.
So invoking those commands without a specifier will show all the attached disks on the system.
(I, also, include parted here and not above because `parted -l /dev/sdd` ignores the specifier and returns all disks anyway.)

```
$ sudo fdisk -l
$ sudo blkid
$ sudo lsblk
$ sudo parted -l
```

# dd

Ok, now that we have identified the disk let's erase it.  The steps above are very important as these next commands are very dangerous and will happily erase your running system if you ask it to, so double check and make sure we have the correct disk in question.

The disk we identified above was `/dev/sdd` but might also look like `/dev/hdb`, or `/dev/vda`, or `/dev/nvme0n1p8` depending on your system.

Some of the main options we'll be using are:

1. `bs` for block size, `count` for how many blocks to write 
1. `if` which is in-file or our source
1. `of` which is out-file or our target.

I am going to be using a low `count` on the below commands so that they don't take that long on this usb drive I am using as an example. To zero and/or random the entire disk leave out the `count` option entirely and the `dd` command will continue writing to the end of the disk.

### /dev/zero

`/dev/zero` is a special 'device' in `/dev` that returns an unlimited amount of zeros.

The first method we'll try is a quick zero:


```
$ sudo dd if=/dev/zero bs=4M count=32 of=/dev/sdd
32+0 records in
32+0 records out
134217728 bytes (134 MB, 128 MiB) copied, 82.2589 s, 1.6 MB/s
```

That will write 128M of zeros to the first sectors of the disk `/dev/sdd`, note that for the most part this destroys without the possibility of anyone retrieving it, there is a lengthy discussion [here](https://superuser.com/questions/1202267/securely-wiping-a-drive-with-dd-dev-zero-or-dev-urandom) and I'm certain elsewhere.o

But let's explore further...

### /dev/random

`/dev/random` is a special 'device' in `/dev` that returns an unlimited amount of pseudo random data, as it is 'pseudo' random it should not be used where real randomness is required.  But for the purposes of obfuscating what was previously on the disk this is will make it very difficult to retrieve data from magnetic media* (*solid state media is a different story).

```
$ time sudo dd if=/dev/random bs=4M count=1 of=/dev/sdd
1+0 records in
1+0 records out
4194304 bytes (4.2 MB, 4.0 MiB) copied, 0.282267 s, 14.9 MB/s
```

### /dev/urandom

`/dev/urandom` is a special 'device' in `/dev` that returns an unlimited amount of random data (that has a higher quality of randomness than `/dev/random`, of note, it is made by a computer so pure randomness is up for debate).

```
time sudo dd if=/dev/urandom bs=4M count=1 of=/dev/sdd
1+0 records in
1+0 records out
4194304 bytes (4.2 MB, 4.0 MiB) copied, 2.62567 s, 1.6 MB/s
```

All of these will write 128M of random to the first sectors of the disk `/dev/sdd`

### Haveged

Of note, you can install [haveged](https://www.issihosts.com/haveged/), 
and `/dev/urandom` will constantly be filled with high quality rando 
and anything that relies on it will become significantly faster, 
with our above dd command ran again after starting haveged we reduces 2.6s to 0.3s.
That's nigh on a full order of magnitude!

```
sudo systemctl start haveged
time sudo dd if=/dev/urandom bs=4M count=1 of=/dev/sdd
1+0 records in
1+0 records out
4194304 bytes (4.2 MB, 4.0 MiB) copied, 0.301117 s, 13.9 MB/s
sudo dd if=/dev/urandom bs=4M count=1 of=/dev/sdd  0.01s user 0.01s system 8% cpu 0.316 total
```

### Luks

We can also just use cryptography itself to fill the disk with high quality random data.

First we will use the `cryptsetup luksFormat`  command on `/dev/sdd`, at the first prompt you must type YES in all caps, then you are prompted for a password twice, and the disk will be formatted for encryption:

```
sudo cryptsetup luksFormat /dev/sdd

WARNING!
========
This will overwrite data on /dev/sdd irrevocably.

Are you sure? (Type 'yes' in capital letters): YES
Enter passphrase for /dev/sdd: 
Verify passphrase: 
sudo cryptsetup luksFormat /dev/sdd  25.82s user 0.97s system 79% cpu 33.708 total
```

Then open it, you will be prompted for the password you just gave above:

```
sudo cryptsetup open /dev/sdd wipecrypt
Enter passphrase for /dev/sdd: 
```

create a filesystem on the open encrypted device:

```
$ sudo mkfs.ext4 -L wipecrypt /dev/mapper/wipecrypt
mke2fs 1.46.5 (30-Dec-2021)
Creating filesystem with 979200 4k blocks and 244800 inodes
Filesystem UUID: 53aa7b9f-4dec-42fa-9ebc-7da1fcd3ddf3
Superblock backups stored on blocks: 
        32768, 98304, 163840, 229376, 294912, 819200, 884736

        Allocating group tables: done                            
        Writing inode tables: done                            
        Creating journal (16384 blocks): done
        Writing superblocks and filesystem accounting information:
```

Create a mnt spot for it, mount it, and then create a zero file to echo some zeros into:

```
$ sudo mkdir /mnt/wipecrypt && sudo mount /dev/mapper/wipecrypt /mnt/wipecrypt && sudo touch /mnt/wipecrypt/zero && sudo chown $USER: /mnt/wipecrypt/zero
```

Now let's write some zeros:

```
$ /usr/bin/time dd if=/dev/zero of=/mnt/wipecrypt/zero bs=4M count=10
10+0 records in
10+0 records out
41943040 bytes (42 MB, 40 MiB) copied, 0.0188705 s, 2.2 GB/s
0.00user 0.02system 0:00.02elapsed 100%CPU (0avgtext+0avgdata 6388maxresident)k
0inputs+81920outputs (0major+1162minor)pagefaults 0swaps
```

Here is a fancy version that uses the yes command to write zeros instead of dd and /dev/zero, this is actually faster than dd, even split across two processes like above, though the usb drive is very slow and unlikely to show much difference here:

```
time yes 0 |pv > /mnt/wipecrypt/zero 
^C1.80GiB 0:06:29 [4.73MiB/s] [      <=>                                                                                                                                                                                                                                                                                                                                             ]

yes 0  0.00s user 0.86s system 0% cpu 6:29.61 total
pv > /mnt/wipecrypt/zero  0.03s user 0.83s system 0% cpu 6:29.61 total]
ls -alh /mnt/wipecrypt/zero       
Permissions Size User  Date Modified Name
.rw-r--r--  1.9G thoth 17 Jun 12:57  /mnt/wipecrypt/zero
```

Which while 4.73MiB/s is slower than the 2.2GB/s above this was sustained over six minutes, whereas the dd command was over a very short period of time.

If you just want to securely delete a single file you can use other commands like [shred](https://linux.die.net/man/1/shred), but for a whole blockdevice I prefer one of the above methods.

{% raw  %}
{% endraw  %}
