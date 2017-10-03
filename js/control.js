var options = {
  collapsed: "",
  withQuotes: ""
};

var trainingData = "";
var requestsParam = {
  list: { rest: "GET", output: "#list-json-renderer" },
  create: { rest: "POST", output: "#create-json-renderer" },
  state: { rest: "GET", output: "#state-json-renderer" },
  classify: { rest: "GET", output: "#classify-json-renderer" },
  del: { rest: "DELETE", output: "#del-json-renderer" },
};


function CheckCredential(key) {

  var username = $('.form-group [name=username]').val();
  var password = $('.form-group [name=password]').val();
  var url = $('#urlSel option:selected').text() + "/v1/classifiers";

  if (username == "" || password == "") {
    $(".alert").removeClass("hidden");
    return;
  } else {
    $(".alert").addClass("hidden");
    var credential = window.btoa(username + ':' + password);
  }

  switch (key) {
    case "list":
      showClassifierList(url, credential, key);
      break;

    case "create":
      createClassifier(url, credential, key)
      break;

    case "state":
      getClassifierState(url, credential, key)
      break;

    case "classify":
      classifyQuestion(url, credential, key)
      break;

    case "del":
      deleteClassifier(url, credential, key)
      break;

    default:
      break;
  }
}

function requestApi(url, credential, key, data) {
  var request = new XMLHttpRequest();

  request.open(requestsParam[key]["rest"], url);
  request.setRequestHeader('Authorization', 'Basic ' + credential);
  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      console.log(request);
      $(requestsParam[key]["output"]).jsonViewer(request.responseText, options);
    } else {
      // 取得成功
      $(requestsParam[key]["output"]).jsonViewer(request.responseText, options);
    }
  };
  request.send(data);
}

// 一覧表示

function showClassifierList(url, credential, key) {
  requestApi(url, credential, key, null);
}

// 分類器作成

function createClassifier(url, credential, key) {
  var language = $('#langSel option:selected').text();
  var classifierName = $('.form-group [name=classifierName]').val();

  var metaData = '{"language":"' + language + '","name":"' + classifierName + '"}';

  var formdata = new FormData();
  formdata.append("training_metadata", metaData);
  formdata.append("training_data", trainingData);

  requestApi(url, credential, key, formdata);
}

// 状態確認

function getClassifierState(url, credential, key) {
  var classifierId = $('.form-group [name=classifierState]').val();
  url = url + "/" + classifierId;

  requestApi(url, credential, key, null);
}

// 質問実行

function classifyQuestion(url, credential, key) {
  var classifierId = $('.form-group [name=question]').val();
  var text = $('.form-group [name=questionText]').val();
  url = url + "/" + classifierId + "/classify?text=" + encodeURIComponent(text);
  requestApi(url, credential, key, null);
}

// 分類器削除

function deleteClassifier(url, credential, key) {
  var classifierId = $('.form-group [name=deleteClassifier]').val();
  url = url + "/" + classifierId;

  requestApi(url, credential, key, null);

}

// ファイル選択時

$(document).on('change', ':file', function () {
  var input = $(this);
  label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  trainingData = input.get(0).files[0];
  input.parent().parent().next(':text').val(label);
});