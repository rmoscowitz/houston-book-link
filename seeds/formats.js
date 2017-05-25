
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('formats').del()
    .then(function () {
      // Inserts seed entries
      return knex('formats').insert([
        { key: 'ebook-pdf-adobe', label: 'Adobe PDF eBook' },
        { key: 'ebook-mediado', label: 'MediaDo eBook'},
        { key: 'periodicals-nook', label: 'NOOK Periodical'},
        { key: 'ebook-epub-adobe', label: 'Adobe EPUB eBook'},
        { key: 'ebook-kindle', label: 'Kindle Book'},
        { key: 'audiobook-mp3', label: 'OverDrive MP3 Audiobook'},
        { key: 'ebook-pdf-open', label: 'Open PDF eBook'},
        { key: 'ebook-overdrive', label: 'OverDrive Read'},
        { key: 'audiobook-overdrive', label: 'OverDrive Listen'},
        { key: 'video-streaming', label: 'Streaming Video'},
        { key: 'ebook-epub-open', label: 'Open EPUB eBook'},
      ]);
    });
};
