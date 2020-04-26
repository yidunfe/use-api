export default function Service(namespace?: string): ClassDecorator {
  return function(target: Function) {
    target.prototype.$namespace = namespace || target.name
  }
}
