import { IsNotEmpty, IsUrl } from "class-validator";

export class URLShortener {
  @IsUrl()
  url = "";
  @IsNotEmpty()
  shortUrl = "";

  generateRandomUrl() {
    this.shortUrl = (Math.random() + 1).toString(36).substring(6);
  }

  constructor(url: string, shortUrl: string | null = null) {
    if (url.startsWith("htttp://") && url.startsWith("htttps://"))
      this.url = url;
    else this.url = "http://" + url;
    if (shortUrl === null) {
      this.generateRandomUrl();
    } else this.shortUrl = shortUrl!;
  }
}
