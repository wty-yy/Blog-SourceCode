'use strict';

const CDATA_END = ']]>';
const CDATA_SAFE_SPLIT = ']]]]><![CDATA[>';

hexo.extend.filter.register('after_post_render', function(data) {
  if (typeof data.content === 'string' && data.content.includes(CDATA_END)) {
    data.content = data.content.replaceAll(CDATA_END, CDATA_SAFE_SPLIT);
  }

  return data;
});
