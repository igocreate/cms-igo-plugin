
const Model     = require('../../plugin').igo.Model;

const schema = {
  table:    'cms_medias',
  columns:  [
    'id',
    'site',
    'uuid',
    'user_id',
    'name',
    'description',
    'filename',
    'type',
    'size',
    'container',
    'fullpath',
    {name: 'is_deleted', type: 'boolean'},
    'deleted_at',
    'deleted_by',
    'created_at'
  ],
  scopes: {
    default: q => q.where({ is_deleted: false })
  }
};

class Media extends Model(schema) {}

module.exports = Media;
