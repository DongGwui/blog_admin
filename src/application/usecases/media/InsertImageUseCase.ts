import { Media } from '@/domain/entities/Media';

export class InsertImageUseCase {
  /**
   * 마크다운 이미지 문법 생성
   * @param url 이미지 URL
   * @param alt 대체 텍스트 (선택)
   * @returns 마크다운 이미지 문법 문자열
   */
  generateMarkdownImage(url: string, alt?: string): string {
    if (!url || !url.trim()) {
      throw new Error('URL is required');
    }

    const altText = alt && alt.trim() ? alt : 'image';
    return `![${altText}](${url})`;
  }

  /**
   * 컨텐츠에 이미지 마크다운 삽입
   * @param content 원본 컨텐츠
   * @param imageMarkdown 삽입할 이미지 마크다운
   * @param position 삽입 위치 (선택, 기본값: 끝에 추가)
   * @returns 이미지가 삽입된 컨텐츠
   */
  insertIntoContent(content: string, imageMarkdown: string, position?: number): string {
    // 빈 컨텐츠인 경우
    if (!content) {
      return imageMarkdown;
    }

    // 위치가 지정되지 않은 경우 끝에 추가
    if (position === undefined) {
      const trimmedContent = content.trimEnd();
      const separator = trimmedContent ? '\n\n' : '';
      return trimmedContent + separator + imageMarkdown;
    }

    // 음수 위치인 경우 처음에 삽입
    if (position < 0) {
      return imageMarkdown + '\n\n' + content;
    }

    // 위치가 0인 경우 처음에 삽입
    if (position === 0) {
      return imageMarkdown + '\n\n' + content;
    }

    // 위치가 컨텐츠 길이보다 큰 경우 끝에 추가
    if (position >= content.length) {
      const trimmedContent = content.trimEnd();
      return trimmedContent + '\n\n' + imageMarkdown;
    }

    // 지정된 위치에 삽입
    const before = content.slice(0, position);
    const after = content.slice(position);
    return before + '\n\n' + imageMarkdown + '\n\n' + after;
  }

  /**
   * Media 객체에서 이미지 마크다운 생성
   * @param media Media 엔티티
   * @param customAlt 사용자 지정 대체 텍스트 (선택)
   * @returns 마크다운 이미지 문법 문자열
   */
  createImageMarkdownFromMedia(media: Media, customAlt?: string): string {
    const altText = customAlt && customAlt.trim() ? customAlt : media.originalName;
    return this.generateMarkdownImage(media.url, altText);
  }
}
