function Post(){
    function bindEvent(){
        $('.post_edit').click(function(e){
            const params = {
                id: $('.id').val(),
                title: $('.title').val(),
                description: $('.description').val(),
                content: tinymce.get('content').getContent()
            };

            const base_url = location.protocol + '//' + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + '/admin/post/edit/',
                type: 'PUT',
                data: params,
                dataType: 'json',
                success: (res) => {
                    if (res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })
        });

        $('.post_delete').click(function(e){
            const post_id = $(this).attr('post_id');

            const base_url = location.protocol + '//' + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + '/admin/post/delete/',
                type: 'DELETE',
                data: {id: post_id},
                dataType: 'json',
                success: (res) => {
                    if (res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })

        });
    }
    bindEvent();
}

$(document).ready(function(){
    new Post();
});