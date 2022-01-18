# Pagenumbers as Text

(currently this script is german-only)

## The Idea

In case you want your pagenummbers not like "1, 2, 3" but like "one, two, three" this script can be of help.

Consider this document as starting point:

![start](./imgs/01-nr.png)

## The Parameters

If the document is facing pages you will get asked for two parameters:

![parameters](./imgs/02-nr.png)

These parameters will result in:

![rel und auto](./imgs/03-nr.png)

With these 

![left auto](./imgs/04-nr.png)

you get

![start](./imgs/05-nr.png)

and with these

![start](./imgs/07-nr.png)

you get

![start](./imgs/06-nr.png)

If the document is not facingPages, the parameters are "not rel to Binding" and "auto resize" by default.

## AutoResize or linked textframes

Textframes can only be autoresized when they are not linked in a story. Thus, if you select autoresize, you'll get an unlinked textframe per page.

# Numbers as text

In `assembleNumberStrings.jsx` and `assembleNumberStringsEn.jsx` you can find the core of the script: the conversion of a number to its string representation.
These two simply write a textfile on the desktop.