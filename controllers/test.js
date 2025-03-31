

function uploadImage(params,uploadRetry){
	if (uploadRetry === 3){
			// 先假設上傳照片三次失敗，回傳錯誤訊息
			throw new error('retry uploadImages over 3 times, please try again')
	}
	const { id, image_file, type } = params;
	let pollingRetries = 0

		function fallback(error){
			console.log(error.message)
			throw new error (error.message)
		}

    function pollingStatusWithRetry(id) {
        request(URL_POLLING, id, (res)=>{
				if (res.status === 0 && pollingRetries < 20) {
        pollingRetries++;
        setDelay(()=>pollingStatusWithRetry(id),2000)
        } else if (res.status === 0 && pollingRetries === 20) {
        // 重試20次仍然處於處理中，顯示訊息詢問客戶端是否繼續等待
        showMessage('是否繼續執行', (result) => {
            if (res.result === true) {
            pollingRetries = 0; // 歸零
            pollingStatusWithRetry(id); 
            } else {
            finishProcess(false); 
            }
        });
        } else if (res.status === 1) {
        finishProcess(true); 
        } else {  // status === 2 
        finishProcess(false); 
        }},fallback(error))
        }

        function infoUserUploadsucceed(id){
            // 此訊息如果需要即時讓客戶端知道，可能會需要使用websocket回傳即時訊息
            console.log('uploadImages succeed!')
        }
		
        request(URL_UPLOAD, {id,image_file,type},(res)=>{
		if (res.status === 1){
            pollingStatusWithRetry(id); 
			infoUserUploadsucceed(id);
        }else {  // res.status === 0
			// 此處想法：如果上傳失敗，一秒後自動重試
            setDelay(()=>uploadImage(url,params, uploadRetry+1),1000)
        }
        },fallback(error))

    }