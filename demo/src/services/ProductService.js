import { Api, Loading, Cache, CacheClear } from '@/helpers/use-api'
class ProductService {

  get namespace () {
    return 'ProductService'
  }

  @Cache('ProductService_productList')
  @Loading('productLoading')
  @Api('/api/product/query.json', { method: 'get' })
  queryProducts (params, result) {
    // console.log('queryProducts ', params, result)
    return result.filter(p => p.id <= 1)
  }

  @CacheClear('ProductService_productList')
  @Api('/api/product/create.json', { method: 'get' })
  createProduct () {}
}

export default new ProductService()
