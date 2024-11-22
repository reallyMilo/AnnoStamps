module.exports = {
  hooks: {
    readPackage(pkg, context) {
      if (pkg.name === 'autosize') {
        pkg.resolved =
          'https://codeload.github.com/mkcy3/autosize/tar.gz/6dea926b1ce18f01de1c62445d1ffc4a8bb80f6b'
      }
      return pkg
    },
  },
}
