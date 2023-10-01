<br/>
<p align="center">
  <h3 align="center">svelte-markdoc-preprocess</h3>

  <p align="center">
    Bring the power of Markdoc right into your Svelte applications!
    <br/>
    <br/>
    <a href="https://svelte-markdoc-preprocess.pages.dev/"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/torstendittmann/svelte-markdoc-preprocess?color=dark-green) ![Issues](https://img.shields.io/github/issues/torstendittmann/svelte-markdoc-preprocess) ![License](https://img.shields.io/github/license/torstendittmann/svelte-markdoc-preprocess) 

## Table Of Contents

* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## Getting Started


### Installation

1. Install the package:
```sh
npm i -D svelte-markdoc-preprocess
```

2. Add the preprocessor and new extensions to your svelte.config.js:

```js
import { markdoc } from 'svelte-markdoc-preprocess';

const config = {
    preprocess: [
        vitePreprocess(),
        markdoc()
    ],
    extensions: ['.markdoc', '.svelte'],
};
```

3. Use it
```md
<!-- +page.markdoc -->
# I am a heading

I am a paragraph with **bold** words. But you can also use Svelte Components:
```

## Roadmap

See the [open issues](https://github.com/torstendittmann/svelte-markdoc-preprocess/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/torstendittmann/svelte-markdoc-preprocess/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.
* Please also read through the [Code Of Conduct](https://github.com/torstendittmann/svelte-markdoc-preprocess/blob/main/CODE_OF_CONDUCT.md) before posting your first idea as well.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/torstendittmann/svelte-markdoc-preprocess/blob/main/LICENSE.md) for more information.

## Authors

* **Torsten Dittmann** - *Lead Engineer @appwrite* - [Torsten Dittmann](https://github.com/TorstenDittmann) - **

## Acknowledgements

* [ShaanCoding](https://github.com/ShaanCoding/)
* [Othneil Drew](https://github.com/othneildrew/Best-README-Template)
* [ImgShields](https://shields.io/)
