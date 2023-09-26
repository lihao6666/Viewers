import dcmjs from 'dcmjs';
import classes from '../../classes';
const { ImageSet } = classes;
const { DicomMetaDictionary } = dcmjs.data;
const { nameMap } = DicomMetaDictionary;

const name = 'ParseTagsService';

function getRowsByDisplaySet(activeDisplaySet, instanceNumber) {
  let metadata;
  if (_isImageStack(activeDisplaySet)) {
    metadata = activeDisplaySet.images[instanceNumber - 1];
  } else {
    metadata = activeDisplaySet.instance || activeDisplaySet;
  }
  const tags = getSortedTags(metadata);
  const formattedRows = getFormattedRowsFromTags(tags, metadata);
  return formattedRows;
}

function getFormattedRowsFromTags(tags, metadata) {
  const rows = [];
  tags.forEach(tagInfo => {
    if (tagInfo.vr === 'SQ') {
      rows.push([
        `${tagInfo.tagIndent}${tagInfo.tag}`,
        tagInfo.vr,
        tagInfo.keyword,
        '',
      ]);

      const { values } = tagInfo;

      values.forEach((item, index) => {
        const formatedRowsFromTags = getFormattedRowsFromTags(item, metadata);

        rows.push([
          `${item[0].tagIndent}(FFFE,E000)`,
          '',
          `Item #${index}`,
          '',
        ]);

        rows.push(...formatedRowsFromTags);
      });
    } else {
      if (tagInfo.vr === 'xs') {
        try {
          const tag = dcmjs.data.Tag.fromPString(tagInfo.tag).toCleanString();
          const originalTagInfo = metadata[tag] || {};
          tagInfo.vr = originalTagInfo.vr;
        } catch (error) {
          console.error(
            `Failed to parse value representation for tag '${tagInfo.keyword}'`
          );
        }
      }
      rows.push([
        `${tagInfo.tagIndent}${tagInfo.tag}`,
        tagInfo.vr,
        tagInfo.keyword,
        tagInfo.value,
      ]);
    }
  });

  return rows;
}

function getSortedTags(metadata) {
  const tagList = getRows(metadata);
  // Sort top level tags, sequence groups are sorted when created.
  _sortTagList(tagList);
  return tagList;
}

function getRows(metadata, depth = 0) {
  // Tag, Type, Value, Keyword

  const keywords = Object.keys(metadata);

  let tagIndent = '';

  for (let i = 0; i < depth; i++) {
    tagIndent += '>';
  }

  if (depth > 0) {
    tagIndent += ' '; // If indented, add a space after the indents.
  }

  const rows = [];
  for (let i = 0; i < keywords.length; i++) {
    let keyword = keywords[i];

    if (keyword === '_vrMap') {
      continue;
    }

    const tagInfo = nameMap[keyword];

    let value = metadata[keyword];

    if (tagInfo && tagInfo.vr === 'SQ') {
      const sequenceAsArray = toArray(value);

      // Push line defining the sequence

      const sequence = {
        tag: tagInfo.tag,
        tagIndent,
        vr: tagInfo.vr,
        keyword,
        values: [],
      };

      rows.push(sequence);

      if (value === null) {
        // Type 2 Sequence
        continue;
      }

      sequenceAsArray.forEach(item => {
        const sequenceRows = getRows(item, depth + 1);

        if (sequenceRows.length) {
          // Sort the sequence group.
          _sortTagList(sequenceRows);
          sequence.values.push(sequenceRows);
        }
      });

      continue;
    }

    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] != 'object') {
        value = value.join('\\');
      }
    }

    if (typeof value === 'number') {
      value = value.toString();
    }

    if (typeof value !== 'string') {
      if (value === null) {
        value = ' ';
      } else {
        if (typeof value === 'object') {
          if (value.InlineBinary) {
            value = 'Inline Binary';
          } else if (value.BulkDataURI) {
            value = `Bulk Data URI`; //: ${value.BulkDataURI}`;
          } else if (value.Alphabetic) {
            value = value.Alphabetic;
          } else {
            console.warn(`Unrecognised Value: ${value} for ${keyword}:`);
            console.warn(value);
            value = ' ';
          }
        } else {
          console.warn(`Unrecognised Value: ${value} for ${keyword}:`);
          value = ' ';
        }
      }
    }

    // tag / vr/ keyword/ value

    // Remove retired tags
    keyword = keyword.replace('RETIRED_', '');
    if (tagInfo) {
      rows.push({
        tag: tagInfo.tag,
        tagIndent,
        vr: tagInfo.vr,
        keyword,
        value,
      });
    } else {
      // skip properties without hex tag numbers
      const regex = /[0-9A-Fa-f]{6}/g;
      if (keyword.match(regex)) {
        const tag = `(${keyword.substring(0, 4)},${keyword.substring(4, 8)})`;
        rows.push({
          tag,
          tagIndent,
          vr: '',
          keyword: 'Private Tag',
          value,
        });
      }
    }
  }
  return rows;
}

function _isImageStack(displaySet) {
  return displaySet instanceof ImageSet;
}

function toArray(objectOrArray) {
  return Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
}

function _sortTagList(tagList) {
  tagList.sort((a, b) => {
    if (a.tag < b.tag) {
      return -1;
    }

    return 1;
  });
}

const publicAPI = {
  name,
  getDicomTags: getRowsByDisplaySet,
};

const ParseTagsService = {
  REGISTRATION: {
    altName: name,
    name: 'parseTagsService',
    create: ({ configuration = {} }) => {
      return publicAPI;
    },
  },
};

export default ParseTagsService;
