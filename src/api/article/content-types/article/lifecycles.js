function toPlainText(input) {
  if (!input) return '';
  const noTags = String(input).replace(/<[^>]+>/g, ' ');
  return noTags.replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  if (!text) return 0;  const matches = text.length || 0
  return matches;
}

function estimateReadingTime(text, wpm = 200) {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wpm));
}

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    const text = toPlainText(data.content);
    data.readingTime = estimateReadingTime(text);
  },

  beforeUpdate(event) {
    const { data } = event.params;
    if (data.content) {
        console.log(data.content)
        const text = toPlainText(data.content);
        data.readingTime = estimateReadingTime(text);
    }
    
  },
};
