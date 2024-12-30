import { convert } from "./index.js";

convert("https://raw.githubusercontent.com/freefq/free/master/v2", "surge").then(console.log).catch(console.error)