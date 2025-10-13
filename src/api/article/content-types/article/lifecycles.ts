function toPlainText(input) {
  if (!input) return "";

  if (typeof input === "object") {
    if (Array.isArray(input)) {
      return input.map(toPlainText).join(" ");
    }
    if (input.type === "text" && input.text) return input.text;
    if (input.children) return input.children.map(toPlainText).join(" ");
    if (input.content) return toPlainText(input.content);
    return "";
  }

  const noTags = String(input).replace(/<[^>]+>/g, " ");
  return noTags.replace(/\s+/g, " ").trim();
}

function countWords(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadingTime(text, wpm = 200) {
  const words = countWords(text);
  const minutes = words / wpm;
  return Math.max(0.01, parseFloat(minutes.toFixed(2)));
}

module.exports = {
  async beforeCreate(event) {
    const { data, where, select } = event.params;
    const user = event.state.user;
    if (user) {
      data.author = user.id;
    }

    if (data.content) {
      const text = toPlainText(data.content);
      data.readingTime = estimateReadingTime(text);
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    if (data.content) {
      const text = toPlainText(data.content);
      data.readingTime = estimateReadingTime(text);
    }
  },
};
