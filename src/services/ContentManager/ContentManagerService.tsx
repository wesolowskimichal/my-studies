class ContentManagerService {
  private static instance: ContentManagerService
  private render = 'all-courses'

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
  }
}

export default ContentManagerService
