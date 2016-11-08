var $ = require('jquery')
var ethJSABI = require('ethereumjs-abi')
var request = require('request')
var bs58 = require('bs58')

var generateOraclize = function (vmInstance,account) {
  if(!vmInstance.executionContext.isVM()){
    $('#oraclizeView').css("background-color","#FF9393")
    $('#oraclizeNotAvailable').show()
    $('#oraclizeVM').hide()
    $('#oraclizeWarning').show()
    $('#oraclizeImg').addClass("blackAndWhite")
    return;
  } else {
    $('#oraclizeWarning').hide()
    $('#oraclizeView').css("background-color","#F4F6FF")
    $('#oraclizeNotAvailable').hide()
    $('#oraclizeVM').show()
  }

  if(typeof(vmInstance.accounts)=='undefined') return

  // remove oraclize account from the transaction tab
  $('#txorigin option[value="'+account+'"]').remove()

  var oar = ''
  var oraclizeConn = ''
  console.log('Deploying with account: '+account)
  var oraclizeConnector = '0x606060405260018054600160a060020a0319167326588a9301b0428d95e6fc3a5024fce8bec12d511790556404a817c80060055560028054600160a060020a03191633179055611a41806100536000396000f36060604052361561015e5760e060020a60003504630f825673811461019a57806323dc42e7146102195780632ef3accc146102b3578063453629781461036e578063480a434d14610403578063524f38891461040c5780635c242c591461046857806360f667011461050957806362b3b8331461058d57806368742da61461060c578063688dcfd71461064c578063757004371461067b57806377228659146107155780637d242ae5146107f05780637e1c42051461087657806381ade3071461036e57806385dee34c146109575780639bb5148714610a31578063a2ec191a14610a69578063adf59f9914610219578063ae8158431461067b578063b5bfdd7314610abc578063bf1fe42014610b45578063c281d19e14610b85578063c51be90f14610b97578063ca6ad1e414610c30578063d959701614610c52578063db37e42f14610d09578063de4b326214610dc0578063e839e65e14610e03575b61067960025433600160a060020a039081169116148015906101905750600154600160a060020a039081163390911614155b15610ed957610002565b6040805160206004803580820135601f8101849004840285018401909552848452610679949193602493909291840191908190840183828082843750949650505050505050600254600160a060020a03908116339091161480159061020f5750600154600160a060020a039081163390911614155b15610f0a57610002565b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760649791965060249190910194509092508291508401838280828437509496505050505050506000610f7084848462030d406104f4565b6040805160206004803580820135601f8101849004840285018401909552848452610edb94919360249390929184019190819084018382808284375094965050933593505050506000610f788383335b600160a060020a03811660009081526007602052604081205462030d40841180159061033757506020829052604082205482145b801561034557506005548111155b8015610360575060015432600160a060020a03908116911614155b156119fc57600091506119f4565b6040805160206004803580820135601f8101849004840285018401909552848452610edb949193602493909291840191908190840183828082843750506040805160208835808b0135601f81018390048302840183019094528383529799986044989297509190910194509092508291508401838280828437509496505050505050506000610f786000848462030d406104f4565b610edb60085481565b6040805160206004803580820135601f8101849004840285018401909552848452610edb9491936024939092918401919081908401838280828437509496505050505050506000610f7f82336000610f788362030d4084610303565b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a01909352828252969897606497919650602491909101945090925082915084018382808284375094965050933593505050505b60006000848360006000610f85848433610303565b6040805160206004803580820135601f810184900484028501840190955284845261067994919360249390929184019190819084018382808284375094965050505050505080604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050604051809103902060046000508190555050565b6040805160206004803580820135601f8101849004840285018401909552848452610679949193602493909291840191908190840183828082843750949650505050505050600254600160a060020a0390811633909116148015906106025750600154600160a060020a039081163390911614155b1561127957610002565b610679600435600254600160a060020a0390811633909116148015906106425750600154600160a060020a039081163390911614155b156112df57610002565b600160a060020a0333166000908152600660205260409020805460f860020a6004350460ff199091161790555b005b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a01909352828252969897606497919650602491909101945090925082915084018382808284375094965050933593505050505b6000611305858585856104f4565b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976064979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a01909352828252969897608497919650602491909101945090925082915084018382808284375094965050505050505060006113058585858562030d40610942565b60408051602060248035600481810135601f81018590048502860185019096528585526106799581359591946044949293909201918190840183828082843750949650505050505050600254600090600160a060020a03908116339091161480159061086c5750600154600160a060020a039081163390911614155b1561130e57610002565b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976064979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a01909352828252969897608497919650602491909101945090925082915084018382808284375094965050933593505050505b600060008583600060006113a6848433610303565b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976064979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976084979196506024919091019450909250829150840183828082843750949650509335935050505060006116f68686868686610942565b610679600435600254600160a060020a0390811633909116141580610a5f575080600160a060020a03166000145b1561170057610002565b6040805160206004803580820135601f8101849004840285018401909552848452610679949193602493909291840191908190840183828082843750949650509335935050505061172282600083610b08565b6040805160206004803580820135601f81018490048402850184019095528484526106799491936024939092918401919081908401838280828437509496505093359350506044359150505b600254600090600160a060020a039081163390911614801590610b3b5750600154600160a060020a039081163390911614155b1561172657610002565b610679600435600254600160a060020a039081163390911614801590610b7b5750600154600160a060020a039081163390911614155b156117e957610002565b610eed600154600160a060020a031681565b60408051602060248035600481810135601f8101859004850286018501909652858552610edb9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760649791965060249190910194509092508291508401838280828437509496505093359350505050600061130585858585610707565b600160a060020a03331660009081526007602052604090206004359055610679565b604080516004803580820135602081810280860182019096528185526106799593946024949093850192918291908501908490808284375050604080518735808a013560208181028085018201909552818452989a99604499939850919091019550935083925085019084908082843750949650505050505050600254600090600160a060020a039081163390911614801590610cff5750600154600160a060020a039081163390911614155b156117ee57610002565b604080516004803580820135602081810280860182019096528185526106799593946024949093850192918291908501908490808284375050604080518735808a013560208181028085018201909552818452989a99604499939850919091019550935083925085019084908082843750949650505050505050600254600090600160a060020a039081163390911614801590610db65750600154600160a060020a039081163390911614155b1561184a57610002565b610679600435600254600090600160a060020a039081163390911614801590610df95750600154600160a060020a039081163390911614155b156118bf57610002565b6040805160206004803580820135601f8101849004840285018401909552848452610edb949193602493909291840191908190840183828082843750506040805160208835808b0135601f8101839004830284018301909452838352979998604498929750919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760649791965060249190910194509092508291508401838280828437509496505050505050506000610f70600085858562030d40610942565b565b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b60006003600050600083604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050604051809103902060001916815260200190815260200160002060006101000a81548160ff0219169083021790555050565b949350505050565b9392505050565b92915050565b915034829010610fda5781340390506000811115610fbe5760405133600160a060020a031690600090839082818181858883f150505050505b42624f1a00018a1180610fd057504587115b15610fdf57610002565b610002565b732bd2326c993dfaef84f696526064ff22eba5b362600160a060020a03166316c727216040518160e060020a0281526004018090506020604051808303816000876161da5a03f115610002575050506040518051906020015094508430336000600050600033600160a060020a03168152602001908152602001600020600050546040518085151560f860020a02815260010184600160a060020a0316606060020a02815260140183600160a060020a0316606060020a0281526014018281526020019450505050506040518091039020955085506000600050600033600160a060020a031681526020019081526020016000206000818150548092919060010191905055507fb76d0edd90c6a07aa3ff7a222d7f5933e29c6acc660c059c97837f05c4ca1a8433878c8c8c8c6006600050600033600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a026007600050600033600160a060020a03168152602001908152602001600020600050546040518089600160a060020a0316815260200188600019168152602001878152602001806020018060200186815260200185600160f860020a03191681526020018481526020018381038352888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156111fe5780820380516001836020036101000a031916815260200191505b508381038252878181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156112575780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390a15050505050949350505050565b60016003600050600083604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050604051809103902060001916815260200190815260200160002060006101000a81548160ff0219169083021790555050565b604051600160a060020a03828116916000913016319082818181858883f1505050505050565b95945050505050565b50600882905560005b600b548110156113a157600b8054600a916000918490811015610002575080547f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db98501548352602093909352604082205486029260099291908590811015610002579060005260206000209001600050548152602081019190915260400160002055600101611317565b505050565b915034829010610fda57813403905060008111156113df5760405133600160a060020a031690600090839082818181858883f150505050505b42624f1a00018b11806113f157504587115b156113fb57610002565b732bd2326c993dfaef84f696526064ff22eba5b362600160a060020a03166316c727216040518160e060020a0281526004018090506020604051808303816000876161da5a03f115610002575050506040518051906020015094508430336000600050600033600160a060020a03168152602001908152602001600020600050546040518085151560f860020a02815260010184600160a060020a0316606060020a02815260140183600160a060020a0316606060020a0281526014018281526020019450505050506040518091039020955085506000600050600033600160a060020a031681526020019081526020016000206000818150548092919060010191905055507faf30e4d66b2f1f23e63ef4591058a897f67e6867233e33ca3508b982dcc4129b33878d8d8d8d8d6006600050600033600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a026007600050600033600160a060020a0316815260200190815260200160002060005054604051808a600160a060020a031681526020018960001916815260200188815260200180602001806020018060200187815260200186600160f860020a031916815260200185815260200184810384528a8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561161f5780820380516001836020036101000a031916815260200191505b508481038352898181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156116785780820380516001836020036101000a031916815260200191505b508481038252888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156116d15780820380516001836020036101000a031916815260200191505b509c5050505050505050505050505060405180910390a1505050505095945050505050565b9695505050505050565b6001805473ffffffffffffffffffffffffffffffffffffffff19168217905550565b5050565b8383604051808380519060200190808383829060006004602084601f0104600302600f01f15090500182600160f860020a0319168152600101925050506040518091039020905080600b600050600b600050805480919060010190908154818355818115116117b8578183600052602060002091820191016117b891905b808211156117e557600081556001016117a4565b5050508154811015610002576000918252602080832090910192909255918252600a905260409020555050565b5090565b600555565b5060005b81518110156113a157828181518110156100025790602001906020020151600760005060008484815181101561000257505060208085028601810151600160a060020a031682529190915260409020556001016117f2565b5060005b81518110156113a15782818151811015610002579060200190602002015160f860020a02600660005060008484815181101561000257505060208085028601810151600160a060020a031682529190915260409020805460ff191660f860020a90920491909117905560010161184e565b50600881905560005b600b5481101561172257600b8054600a916000918490811015610002575080547f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db985015483526020939093526040822054850292600992919085908110156100025790600052602060002090016000505481526020810191909152604001600020556001016118c8565b60096000506000866006600050600087600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a02604051808380519060200190808383829060006004602084601f0104600302600f01f15090500182600160f860020a031916815260010192505050604051809103902060001916815260200190815260200160002060005054915081508084028201915081508191505b509392505050565b8060001415611a0a57506005545b600454600014801590611a33575060045460009081526003602052604090205460ff1615156001145b1561195257600091506119f456'

  var oraclizeAddressResolver = '0x606060405260018054600160a060020a0319163317905560f3806100236000396000f3606060405260e060020a600035046338cc483181146038578063767800de146062578063a6f9dae1146073578063d1d80fdf146091575b005b600054600160a060020a03165b60408051600160a060020a03929092168252519081900360200190f35b6045600054600160a060020a031681565b603660043560015433600160a060020a0390811691161460af576002565b603660043560015433600160a060020a0390811691161460d1576002565b6001805473ffffffffffffffffffffffffffffffffffffffff19168217905550565b6000805473ffffffffffffffffffffffffffffffffffffffff1916821790555056'

  if(vmInstance.executionContext.isVM()){
    vmInstance.rawRunTx({"from":account,"data":oraclizeConnector,"gasLimit":3000000}, function (err, result) {
      if(err) console.log(err);
      var contractAddr = new Buffer(result.createdAddress).toString('hex')
      oraclizeConn = "0x"+contractAddr
      console.log("Generated connector: "+oraclizeConn)
      var setCbAddress = "0x9bb51487000000000000000000000000"+account.replace('0x','')
      vmInstance.rawRunTx({"from":account,"to":oraclizeConn,"data":setCbAddress,"gasLimit":3000000}, function (err, result) {
        if(err) console.log(err);
        // OAR generate
        vmInstance.rawRunTx({"from":account,"data":oraclizeAddressResolver,"gasLimit":3000000}, function (err, result) {
          if(err) console.log(err);
          var resultAddr = new Buffer(result.createdAddress).toString('hex')
          oar = "0x"+resultAddr
          console.log("Generated oar: "+oar)
          var setAddr = "0xd1d80fdf000000000000000000000000"+(oraclizeConn.replace('0x',''))
          vmInstance.rawRunTx({"from":account,"to":oar,"data":setAddr,"gasLimit":3000000}, function (err, result) {
            if(err) console.log(err);
            $('#oraclizeStatus').html('<span class="green">READY</span>')
            $('#oraclizeImg').removeClass("blackAndWhite")
            $('#oarLine').val('OAR = OraclizeAddrResolverI('+oar+');')
            runLog(vmInstance,oraclizeConn)
          })
        })
      })
    })

    function runLog(vmInstance,connectorAddr){
      vmInstance.vm.on('afterTx', function (response) {
        for (var i in response.vm.logs) {
          var log = response.vm.logs[i]
          var decoded
          var log = response.vm.logs[i]
          if("0x"+log[0].toString('hex')==connectorAddr){
            var eventSignature = log[1][0].toString('hex')
            if(eventSignature=="b76d0edd90c6a07aa3ff7a222d7f5933e29c6acc660c059c97837f05c4ca1a84"){ // Log1 signature
              var types = ["address","bytes32","uint256","string","string","uint256","bytes1","uint256"] // event Log1
              decoded = ethJSABI.rawDecode(types, log[2])
              decoded = ethJSABI.stringify(types, decoded)
              decoded = {"sender":decoded[0],"cid":decoded[1],"timestamp":decoded[2],"datasource":decoded[3],"arg":decoded[4],"gaslimit":decoded[5],"proofType":decoded[6],"gasPrice":decoded[7]}
            } else if(eventSignature=="af30e4d66b2f1f23e63ef4591058a897f67e6867233e33ca3508b982dcc4129b"){ // Log2 signature
              var types = ["address","bytes32","uint256","string","string","string","uint256","bytes1","uint256"] // event Log2
              decoded = ethJSABI.rawDecode(types, log[2])
              decoded = ethJSABI.stringify(types, decoded)
              decoded = {"sender":decoded[0],"cid":decoded[1],"timestamp":decoded[2],"datasource":decoded[3],"arg1":decoded[4],"arg2":decoded[5],"gaslimit":decoded[6],"proofType":decoded[7],"gasPrice":decoded[8]}
            }
            if(!$('#queryHistoryContainer').find('.datasource').length) $('#queryHistoryContainer').html('');
            console.log(decoded)
            var myid = decoded['cid']
            var myIdInitial = myid
            var cAddr = decoded['sender']
            var ds = decoded['datasource']
            if(typeof(decoded['arg']) != 'undefined'){
              var formula = decoded['arg']
            } else {
              var arg2formula = decoded['arg2']
              var formula = [decoded['arg1'],arg2formula]
            }
            if($('#query_'+myIdInitial).length!=0){
              return
            }
            var dateQuery = new Date()
            dateQuery = dateQuery.getHours()+":"+dateQuery.getMinutes()+":"+dateQuery.getSeconds()
            var queryInfoTitle = "Time: "+dateQuery+"\n"+"myid: "+myIdInitial
            var queryHtml = "<div id='query_"+myIdInitial+"' title='"+queryInfoTitle+"' style='margin-bottom:4px;'><span><span class='datasource'>"+ds+"</span> "+formula+"</span><br></div>"
            $('#queryHistoryContainer').append(queryHtml)

            var time = parseInt(decoded['timestamp'])
            var gasLimit = decoded['gaslimit']
            var proofType = decoded['proofType']
            var query = {
                when: time,
                datasource: ds,
                query: formula,
                proof_type: parseInt(proofType)
            }
            console.log(formula)
            console.log(JSON.stringify(query))
            createQuery(query, function(data){
              console.log("Query : "+data)
              data = JSON.parse(data)
              myid = data.result.id
              console.log("New query created, id: "+myid)
              console.log("Checking query status every 5 seconds..")
              updateQueryNotification(1);
              var interval = setInterval(function(){
                // check query status
                checkQueryStatus(myid, function(data){ 
                  data = JSON.parse(data)
                  console.log("Query result: "+JSON.stringify(data))
                  if(data.result.checks==null) return; 
                  var last_check = data.result.checks[data.result.checks.length-1]
                  var query_result = last_check.results[last_check.results.length-1]
                  var dataRes = query_result
                  var dataProof = data.result.checks[data.result.checks.length-1]['proofs'][0]
                  if (!last_check.success) return;
                  else clearInterval(interval)
                  if(dataProof==null && proofType!='0x00'){
                    dataProof = new Buffer('None')
                  }
                  oraclizeCallback(vmInstance, account, gasLimit, myIdInitial, dataRes, dataProof, cAddr)
                })
                        
              }, 5*1000)
            })
          }
        }
      })
    }
    function oraclizeCallback(vmInstance, mainAccount, gasLimit, myid, result, proof, contractAddr){
      if(proof==null){
        var callbackData = ethJSABI.rawEncode(["bytes32","string"],[myid,result]).toString('hex')
        vmInstance.rawRunTx({"from":mainAccount,"to":contractAddr,"gasLimit":gasLimit,"value":0,"data":"0x27dc297e"+callbackData}, function(e, tx){
          if(e || tx.vm.exceptionError){
            var error = e || tx.vm.exceptionError
            result = '<span style="color:#F00;">'+error+'</span>'
            console.log(error)
          }
          $('#query_'+myid).append('<span class="queryResult">=</span> '+result)
        })
      } else {
        var inputProof = (proof.length==46) ? bs58.decode(proof) : proof
        var callbackData = ethJSABI.rawEncode(["bytes32","string","bytes"],[myid,result,inputProof]).toString('hex')
        vmInstance.rawRunTx({"from":mainAccount,"to":contractAddr,"gasLimit":gasLimit,"value":0,"data":"0x38BBFA50"+callbackData}, function(e, tx){
          if(e || tx.vm.exceptionError){
            var error = e || tx.vm.exceptionError
             result = '<span style="color:#F00;">'+error+'</span>'
             console.log(error)
          }
          $('#query_'+myid).append('<span class="queryResult">=</span> '+result+'<br><span style="color:#666;">Proof:</span> '+proof)
        })
          console.log('proof: '+proof)
      }
      updateQueryNotification(1)
      console.log('myid: '+myid)
      console.log('result: '+result)
      console.log('Contract '+contractAddr+ ' __callback called')
    }

    function updateQueryNotification(count){
      var activeTab = $('#optionViews').attr('class')
      if(activeTab!='oraclizeView'){
        $('#queryNotification').show()
        $('#queryNotification').html(count+parseInt($('#queryNotification').text()))
      }
    }

    $('.oraclizeView').on('click', function(e){
      e.preventDefault()
      $('#queryNotification').hide()
      $('#queryNotification').html('0')
    })

    $('.clearQueries').on('click', function(e){
      e.preventDefault()
      $('#queryHistoryContainer').html('')
    })

  }
}

function createQuery(query, callback){
  request.post('https://api.oraclize.it/v1/query/create', {body: JSON.stringify(query), headers:{"X-Context":"browser-solidity"} }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body)
    }
  })
}

function checkQueryStatus(query_id, callback){
  request.get('https://api.oraclize.it/v1/query/'+query_id+'/status', { headers:{"X-Context":"browser-solidity"} }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body)
    }
  })
}


module.exports = {
  'generateOraclize': generateOraclize
}

