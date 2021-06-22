export default {
  methods: {
    downloadFile(id, content) {
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
      );

      const {format} = this.$store.state;

      const fileExtension = format === 'wkt' ? 'txt' : 'geojson';

      element.setAttribute('download', `${id}.${fileExtension}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
  },
};
