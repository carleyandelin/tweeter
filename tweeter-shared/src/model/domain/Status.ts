import { PostSegment, Type } from "./PostSegment";
import { User } from "./User";
import { StatusDto } from "../dto/StatusDto";
import { format } from "date-fns";

export class Status {
  private _post: string;
  private _user: User;
  private _timestamp: number;
  private _segments: PostSegment[];

  public constructor(post: string, user: User, timestamp: number) {
    this._post = post;
    this._user = user;
    this._timestamp = timestamp;
    this._segments = this.getPostSegments(post);
  }

  public get post(): string { return this._post; }
  public set post(value: string) { this._post = value; }
  public get user(): User { return this._user; }
  public set user(value: User) { this._user = value; }
  public get timestamp(): number { return this._timestamp; }
  public set timestamp(value: number) { this._timestamp = value; }
  public get segments(): PostSegment[] { return this._segments; }
  public set segments(value: PostSegment[]) { this._segments = value; }

  public get formattedDate(): string {
    return format(new Date(this.timestamp), "MMMM dd, yyyy HH:mm:ss");
  }

  public get dto(): StatusDto {
    return {
      post: this._post,
      user: this._user.dto,
      timestamp: this._timestamp,
    };
  }

  public static fromDto(dto: StatusDto | null | undefined): Status | null {
    if (!dto) return null;
    const user = User.fromDto(dto.user);
    if (!user) return null;
    return new Status(dto.post, user, dto.timestamp);
  }

  public equals(other: Status): boolean {
    return this._user.equals(other.user) && this._timestamp === other._timestamp && this._post === other.post;
  }

  public static fromJson(json: string | null | undefined): Status | null {
    if (!json) return null;
    const o: { _post: string; _user: { _firstName: string; _lastName: string; _alias: string; _imageUrl: string }; _timestamp: number } = JSON.parse(json);
    return new Status(o._post, new User(o._user._firstName, o._user._lastName, o._user._alias, o._user._imageUrl), o._timestamp);
  }

  public toJson(): string { return JSON.stringify(this); }

  // ── Segment parsing (unchanged from original) ──────────────────────────────
  private getPostSegments(post: string): PostSegment[] {
    const segments: PostSegment[] = [];
    let startIndex = 0;
    for (let ref of Status.getSortedReferences(post)) {
      if (startIndex < ref.startPostion) {
        segments.push(new PostSegment(post.substring(startIndex, ref.startPostion), startIndex, ref.startPostion - 1, Type.text));
      }
      segments.push(ref);
      startIndex = ref.endPosition;
    }
    if (startIndex < post.length) {
      segments.push(new PostSegment(post.substring(startIndex), startIndex, post.length, Type.text));
    }
    return segments;
  }

  private static getSortedReferences(post: string): PostSegment[] {
    return [...Status.parseUrlReferences(post), ...Status.parseMentionReferences(post), ...Status.parseNewlines(post)]
      .sort((a, b) => a.startPostion - b.startPostion);
  }

  private static parseUrlReferences(post: string): PostSegment[] {
    const refs: PostSegment[] = [];
    let prev = 0;
    for (let url of Status.parseUrls(post)) {
      const start = post.indexOf(url, prev);
      if (start > -1) { refs.push(new PostSegment(url, start, start + url.length, Type.url)); prev = start + url.length; }
    }
    return refs;
  }

  private static parseUrls(post: string): string[] {
    return post.split(/(\s+)/).filter(w => w.startsWith("http://") || w.startsWith("https://"))
      .map(w => w.substring(0, Status.findUrlEndIndex(w)));
  }

  private static findUrlEndIndex(word: string): number {
    for (const ext of [".com", ".net", ".org", ".edu", ".mil"]) {
      const i = word.indexOf(ext);
      if (i !== -1) return i + 4;
    }
    let i = word.length;
    while (i > 0 && !Status.isLetter(word[i - 1])) i--;
    return i;
  }

  private static isLetter(c: string): boolean { return c.length === 1 && /[a-zA-Z]/.test(c); }

  private static parseMentionReferences(post: string): PostSegment[] {
    const refs: PostSegment[] = [];
    let prev = 0;
    for (let mention of post.split(/(\s+)/).filter(w => w.startsWith("@"))) {
      const start = post.indexOf(mention, prev);
      if (start > -1) { refs.push(new PostSegment(mention, start, start + mention.length, Type.alias)); prev = start + mention.length; }
    }
    return refs;
  }

  private static parseNewlines(post: string): PostSegment[] {
    const refs: PostSegment[] = [];
    const regex = /\n/g;
    let match;
    while ((match = regex.exec(post)) !== null) {
      refs.push(new PostSegment("\n", match.index, match.index + 1, Type.newline));
    }
    return refs;
  }
}