This is a follow up to the issue about npm [https://github.com/npm/npm/issues/6855](https://github.com/npm/npm/issues/6855), 
which keeps git folder in the tmp when installing from git dependencies, like `git+ssh://git@github.com/nemisj/clean-npm-tmp.git`.

This version package supports both windows and Linux.

## Usage

In order to use it, you have to include `clean-npm-tmp` as dependency:

`npm i --save clean-npm-tmp`

and add the execution into the `postinstall`

```
{
  "name": "XXX-YYY-Zzz",
  "version": "1.0.0",
  "postinstall": "clean-npm-tpm"
}
```

