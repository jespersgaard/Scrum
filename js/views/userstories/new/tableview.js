NewUserStoriesTableView = Tableview.extend({
	initialize : function(options){
		NewUserStoriesTableView.__super__.initialize.apply(this);

		var $header = this.$header = $('<h4>New User Stories</h4></hr>' + 
			'<div class="btn-group">' + 
			'<a href="#userstories/changeGroup?' + $.param({ fromGroup:'new', toGroup:'accepted', action:'access', id:'all'}) + '" class="btn btn-small"><i class="icon-ok"></i> Accept</a>' + 
			'<a href="#userstories/changeGroup?' + $.param({ fromGroup:'new', toGroup:'trashed', action:'drop', id:'all'}) + '" class="btn btn-small"><i class="icon-trash"></i> Trash</a>' + 
			'<a href="#userstories/create" class="btn btn-small"><i class="icon-plus"></i> Add</a>' + 
		'</div>' + 
		'<div class="btn-group pull-right">' + 
			'<a href="#userstories/refresh" class="btn btn-small pull-right" ><i class="icon-repeat"></i> Refresh</a>' + 
		'</div><hr/>');
		var $table =  $('<div><table id="new_userstories_table" class="table table-condensed table-hover"><thead></thead><tbody></tbody></table></div>');
		this.inline = new InlineDropdown({ 
			title : 'Actions',
			embedTo : 'td:last', 
			triggerOn : 'table', 
			delegateTo : 'tr.active-row',
			items : [
					{ id :'new_edit', title : 'Edit', icon:'icon-pencil', href : '#/userstories/new/edit/'}, 
					{ id:'new_drop', title : 'Drop', icon:'icon-trash' , href : '#/userstories/changeGroup?' + $.param({ fromGroup: 'new', toGroup:'trashed', action:'drop', id:''}) }, 
					{ id:'new_view', title : 'View', icon:'icon-search', href : '/userstories/get?id='}
					]
		});
		this.tblId = _.uniqueId('tbl');
		$('thead', $table).append(
		  '<th class="span1"><input class="check-all" type="checkbox"></th>'  +
	      '<th class="span2">Name</th>' + 
	      '<th class="span2">Description</th>' +
	      '<th class="span1">Estimate</th>' + 
	      '<th class="span1">Priority</th>' +
	      '<th class="span2"></th>');

		this.$table = $('table',$table).dataTable({
		'sDom' : '<"row-fluid"<"span6"l><"span4 pull-right"f>r>t<"row-fluid"<"span6"i><"span5 pull-right"p>>',
		"sPaginationType": "bootstrap",
		"fnRowCallback" : function(nRow, aData){
			$(nRow).addClass("active-row");
			$(nRow).data('id', aData.id);
			$(nRow).attr('record-id', aData.id);
		},
		"aoColumns" : [
			{"sDefaultContent" : '<input class="check-row" type="checkbox">'},
			{"mData" : "name", "mRender" : function(name){ return '<strong>' + name + '</strong>';}},
			{"mData" : "description", "sClass" : 'description-col', "mRender" : function(description, type, list){
				descriptionHtml = '<span>' + description.substr(0,144) + '</span>';
				if (description.length >= 144){
					descriptionHtml += '<span class="read-more-string"><a href="#">Read more</a></span>';
					descriptionHtml += '<span class="hide">' + description.substr(144, description.length) + '</span>';
					descriptionHtml += '<span class="hide-string"><a href="#">Hide</a></span>';
				}
				return descriptionHtml;
			}},
			{"mData" : 'estimate'},
			{"mData" : 'priority'},
			{"sDefaultContent" : '', 'sClass' : 'actions-col'}
		]});
		
		this.$container = $table;
	}
});