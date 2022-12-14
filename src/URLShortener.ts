import { IsNotEmpty, IsUrl } from "class-validator";

export class URLShortener {
  @IsUrl()
  url = "";
  @IsNotEmpty()
  @IsUrl()
  shortUrl = "";

  generateRandomUrl() {
    this.shortUrl = (Math.random() + 1).toString(36).substring(6);
  }

  constructor(url: string, shortUrl: string | null = null) {
    if (url.startsWith("http://") || url.startsWith("https://"))
      this.url = url;
    else this.url = "http://" + url;
    if (shortUrl === null) {
      this.generateRandomUrl();
    } else this.shortUrl = shortUrl!;
  }
}
