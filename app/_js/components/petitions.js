(function (doc, win) {
  "use strict";

  var
    actionNetworkForm = doc.getElementById('petition-form') || doc.createElement('div');

  function preSubmit() {

    window.hideForm();

    actionNetworkForm.commit.setAttribute('disabled', true);
  }

  function compilePayloadPetition() {
    /**
     * Compiles FormData to send off to mothership queue
     *
     * @return {FormData} formData
     * */

    var
      tags = JSON.parse(actionNetworkForm['signature[tag_list]'].value),
      formData = new FormData();

    formData.append('guard', '');
    formData.append('hp_enabled', true);
    formData.append('org', 'fftf');
    formData.append('tag', actionNetworkForm.dataset.mothershipTag);
    formData.append('an_tags', JSON.stringify(tags));
    formData.append('an_url', win.location.href);
    formData.append('an_petition', actionNetworkForm.action.replace(/\/signatures\/?/, ''));
    formData.append('member[first_name]', actionNetworkForm['signature[first_name]'].value);
    formData.append('member[email]', actionNetworkForm['signature[email]'].value);
    formData.append('member[postcode]', actionNetworkForm['signature[zip_code]'].value);
    formData.append('member[country]', 'US');

    if (actionNetworkForm['member[phone_number]'] && actionNetworkForm['member[phone_number]'].value !== '') {
      formData.append('member[phone_number]', actionNetworkForm['member[phone_number]'].value);
    }

    return formData;
  }

  function confirmSMSSubmission() {
    actionNetworkForm.reset();
    doc.getElementById('form-phone_number').setAttribute('value', 'All set!');
    doc.getElementById('form-phone_number').setAttribute('disabled', true);
    doc.getElementById('submit-phone').setAttribute('disabled', true);
  }

  function submitForm(event) {
    /**
     * Submits the form to ActionNetwork or Mothership-Queue
     *
     * @param {event} event - Form submission event
     * */

    event.preventDefault();

    var
      submission = new XMLHttpRequest();

    if (actionNetworkForm['signature[zip_code]'].value === '') {
      // Since iOS Safari doesn’t do its goddamn job.
      return;
    }

    if (!actionNetworkForm['member[phone_number]'] || actionNetworkForm['member[phone_number]'].value === '') {
      preSubmit();
    }

    function handleHelperError(e) {
      /**
       * Figures out what to say at just the right moment
       * @param {event|XMLHttpRequest} e - Might be an event, might be a response
       * from an XMLHttpRequest
       * */

      win.modals.dismissModal();

      var
        error = e || {},
        errorMessageContainer = doc.createElement('div'),
        errorMessage = doc.createElement('h2'),
        errorMessageInfo = doc.createElement('p');

      errorMessage.textContent = 'Something went wrong';

      if (error.type) {
        errorMessageInfo.textContent = 'There seems to be a problem somewhere in between your computer and our server. Might not be a bad idea to give it another try.';
      } else if (error.status) {
        errorMessageInfo.textContent = '(the nerdy info is that the server returned a status of "' + error.status + '" and said "' + error.statusText + '".)'
      } else {
        errorMessageInfo.textContent = 'this seems to be a weird error. the nerds have been alerted.';
      }

      errorMessageContainer.appendChild(errorMessage);
      errorMessageContainer.appendChild(errorMessageInfo);

      actionNetworkForm.commit.removeAttribute('disabled');

      win.modals.generateModal({contents: errorMessageContainer});
    }

    function loadHelperResponse() {
      /**
       * Does the thing after we get a response from the API server
       * */

      if (submission.status >= 200 && submission.status < 400) {
        if (actionNetworkForm['member[phone_number]'] && actionNetworkForm['member[phone_number]'].value !== '') {
          confirmSMSSubmission();
        } else {
          console.log(submission);
        }
      } else {
        handleHelperError(submission);
      }
    }

    submission.open('POST', 'https://queue.fightforthefuture.org/action', true);
    submission.addEventListener('error', handleHelperError);
    submission.addEventListener('load', loadHelperResponse);
    submission.send(compilePayloadPetition());
  }

  actionNetworkForm.addEventListener('submit', submitForm);

})(document, window);
