(function(){"use strict";angular.module("SOGo.MailerUI",["ngSanitize","ui.router","ck","angularFileUpload","SOGo.Common","SOGo.ContactsUI","ngAnimate","SOGo.PreferencesUI"]).config(configure).run(runBlock).controller("MessageEditorControllerPopup",MessageEditorControllerPopup);configure.$inject=["$stateProvider","$urlRouterProvider"];function configure($stateProvider,$urlRouterProvider){$stateProvider.state("mail",{url:"/Mail","abstract":true,views:{message:{template:"<ui-view/>"}},resolve:{stateAccounts:stateAccounts}}).state("mail.account",{url:"/:accountId","abstract":true,template:'<ui-view id="account"/>',resolve:{stateAccount:stateAccount}}).state("mail.account.mailbox",{url:"/:mailboxId","abstract":true,template:'<ui-view id="mailbox"/>',resolve:{stateMailbox:stateMailbox}}).state("mail.account.mailbox.newMessage",{url:"/new",views:{"message@":{template:"<ui-view/>",controller:"MessageEditorControllerPopup"}},resolve:{stateMessage:stateNewMessage}}).state("mail.account.mailbox.message",{url:"/:messageId",views:{"message@":{templateUrl:"UIxMailViewTemplate",controller:"MessageController",controllerAs:"viewer"}},resolve:{stateMessage:stateMessage}}).state("mail.account.mailbox.message.edit",{url:"/edit",views:{"message@":{templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor"}},resolve:{stateContent:stateContent}}).state("mail.account.mailbox.message.action",{url:"/{actionName:(?:reply|replyall|forward)}",views:{message:{templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor"}}});$urlRouterProvider.otherwise("/Mail/0/folderINBOX/new")}stateAccounts.$inject=["$q","Account"];function stateAccounts($q,Account){var promise=Account.$findAll();return promise.then(function(accounts){var promises=[];angular.forEach(accounts,function(account,i){var mailboxes=account.$getMailboxes();promises.push(mailboxes.then(function(objects){return account}))});return $q.all(promises)})}stateAccount.$inject=["$stateParams","stateAccounts"];function stateAccount($stateParams,stateAccounts){return _.find(stateAccounts,function(account){return account.id==$stateParams.accountId})}stateMailbox.$inject=["$stateParams","stateAccount","decodeUriFilter"];function stateMailbox($stateParams,stateAccount,decodeUriFilter){var mailboxId=decodeUriFilter($stateParams.mailboxId),_find;_find=function(mailboxes){var mailbox=_.find(mailboxes,function(o){return o.path==mailboxId});if(!mailbox){angular.forEach(mailboxes,function(o){if(!mailbox&&o.children&&o.children.length>0){mailbox=_find(o.children)}})}return mailbox};return _find(stateAccount.$mailboxes)}stateNewMessage.$inject=["stateAccount"];function stateNewMessage(stateAccount){return stateAccount.$newMessage()}stateMessage.$inject=["encodeUriFilter","$stateParams","$state","stateMailbox","Message"];function stateMessage(encodeUriFilter,$stateParams,$state,stateMailbox,Message){var data={uid:$stateParams.messageId.toString()},message=new Message(stateMailbox.$account.id,stateMailbox,data);return message.$reload()}stateContent.$inject=["stateMessage"];function stateContent(stateMessage){return stateMessage.$editableContent()}runBlock.$inject=["$rootScope"];function runBlock($rootScope){$rootScope.$on("$routeChangeError",function(event,current,previous,rejection){console.error(event,current,previous,rejection)})}MessageEditorControllerPopup.$inject=["$window","$mdDialog","stateAccounts","stateMessage"];function MessageEditorControllerPopup($window,$mdDialog,stateAccounts,stateMessage){$mdDialog.show({hasBackdrop:false,disableParentScroll:false,clickOutsideToClose:false,escapeToClose:false,templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",locals:{stateAccounts:stateAccounts,stateMessage:stateMessage,stateRecipients:[]}}).finally(function(){if($window.opener)$window.close()})}})();
//# sourceMappingURL=Mailer.app.popup.js.map