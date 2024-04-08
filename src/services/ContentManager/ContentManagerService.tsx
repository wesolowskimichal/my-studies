class ContentManagerService {
  private static instance: ContentManagerService
  private render = 'all-courses'
  private renderCallbacks: Function[] = [] // Array to hold callback functions

  private constructor() {}

  public static getInstance(): ContentManagerService {
    if (!ContentManagerService.instance) {
      ContentManagerService.instance = new ContentManagerService()
    }
    return ContentManagerService.instance
  }

  public getRender(): string {
    return this.render
  }

  public setRender(render: string) {
    this.render = render
    // Call all registered callback functions when render value changes
    this.renderCallbacks.forEach(callback => callback(render))
  }

  // Method to register callback functions
  public setRenderCallback(callback: Function) {
    this.renderCallbacks.push(callback)
  }

  // Method to remove registered callback functions
  public removeRenderCallback(callback: Function) {
    this.renderCallbacks = this.renderCallbacks.filter(cb => cb !== callback)
  }
}

export default ContentManagerService
