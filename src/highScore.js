class HighScore {
  records;
  constructor(records) {
    this.records = records.map(([desc, score]) => new Record(desc, score));
    this.sort();
  }

  sort() {
    this.records = this.records.sort((rec2, rec1) => {
      if (rec1.score < rec2.score) {
        return -1;
      }
      if (rec1.score > rec2.score) {
        return 1;
      }
      return 0;
    });
  }

  add(score = 0) {
    const date = new Date().toLocaleDateString();
    this.records.push(new Record(date, score));
    this.sort();
    if (this.records.length > 5) {
      this.records.pop();
    }
  }
}

class Record {
  constructor(description, score) {
    this.description = description;
    this.score = score;
  }

  isBiggerThan(record) {
    return this.score > record.score;
  }
}

module.exports.HighScore = HighScore;
