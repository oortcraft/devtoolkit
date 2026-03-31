const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
  'Nulla facilisi morbi tempus iaculis urna id volutpat lacus.',
  'Viverra accumsan in nisl nisi scelerisque eu ultrices vitae.',
  'Amet consectetur adipiscing elit pellentesque habitant morbi tristique.',
  'Egestas integer eget aliquet nibh praesent tristique magna sit amet.',
  'Turpis egestas pretium aenean pharetra magna ac placerat vestibulum.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames.',
  'Adipiscing elit ut aliquam purus sit amet luctus venenatis.',
  'Feugiat in fermentum posuere urna nec tincidunt praesent semper.',
  'Sagittis vitae et leo duis ut diam quam nulla porttitor.',
  'Consequat mauris nunc congue nisi vitae suscipit tellus mauris.',
  'Cras semper auctor neque vitae tempus quam pellentesque nec.',
  'Bibendum est ultricies integer quis auctor elit sed vulputate.',
  'Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
  'Faucibus ornare suspendisse sed nisi lacus sed viverra tellus in.',
  'Risus pretium quam vulputate dignissim suspendisse in est ante.',
];

export function generateLoremIpsum(paragraphs: number): string {
  const count = Math.max(1, Math.min(10, paragraphs));
  const result: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentenceCount = 4 + Math.floor(Math.random() * 5);
    const sentences: string[] = [];
    for (let s = 0; s < sentenceCount; s++) {
      if (p === 0 && s === 0) {
        sentences.push(LOREM_SENTENCES[0]);
      } else {
        sentences.push(LOREM_SENTENCES[Math.floor(Math.random() * LOREM_SENTENCES.length)]);
      }
    }
    result.push(sentences.join(' '));
  }
  return result.join('\n\n');
}
