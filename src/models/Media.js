
const uuidV4    = require('uuid/v4');

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
    'is_deleted',
    'deleted_at',
    'deleted_by',
    'created_at'
  ],
  scopes: {
    default: function(query) {
      query.where({ is_deleted: false });
    }
  }
};

class Media extends Model(schema) {

  constructor(values) {
    super(values);
    this.is_deleted = !!this.is_deleted;
  }

  beforeCreate(callback) {
    this.uuid = uuidV4();
    callback();
  }
}

module.exports = Media;
