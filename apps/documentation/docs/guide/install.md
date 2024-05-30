# Install

Install the package:

```sh
npm i -D svelte-markdoc-preprocess
```

Add the preprocessor and new extensions to your `svelte.config.js`:

```javascript
import { markdoc } from 'svelte-markdoc-preprocess';

const config = {
    preprocess: [
        vitePreprocess(),
        markdoc()
    ],
    extensions: ['.markdoc', '.svelte'],
};
```

```md title="+page.markdoc"
# I am a heading

I am a paragraph with **bold** words. But you can also use Svelte Components:
```
