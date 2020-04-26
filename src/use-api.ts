// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import Api from './packages/api'
import Loading from './packages/loading'
import Cache, { CacheClear } from './packages/cache'
import VueLoadingPlugin from './vue-plugins/loading'

export default Api
export { Loading, Cache, CacheClear, VueLoadingPlugin }
