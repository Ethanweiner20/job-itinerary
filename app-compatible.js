"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var jobRoom;
var jobUI = new JobUI(jobForm);
var list;
var listUI = new ListUI(listGroup);
var select;
deleteWorkerButton.disabled = true;

var refreshForm = function refreshForm(worker) {
  jobRoom.updateWorker(worker);
  jobRoom.getJob(function (data) {
    jobUI.fillForm(data);
  });
  currentWorkerSpan.innerText = worker;
};

var selectFirstWorker = function selectFirstWorker() {
  if (workersSelect.children[1]) {
    workersSelect.children[0].selected = false;
    workersSelect.children[1].selected = true;
    workersSelect.dispatchEvent(new Event('change'));
  } else {
    jobForm.classList.add('d-none');
  }
};

setTimeout(selectFirstWorker, 1200); // Selecting Worker

workersSelect.addEventListener('change', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (e.target.classList.contains('workers-select')) {
              refreshForm(e.target.value);
            }

            deleteWorkerButton.disabled = false;

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()); // Adding Worker

newWorkerForm.addEventListener('submit', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
    var worker;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            jobUI.resetForm();
            worker = newWorkerForm.name.value;
            jobRoom.addWorker(worker);
            jobRoom.getJob();
            newWorkerForm.name.value = '';
            $('#new-worker-modal').modal('hide');

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()); // Deleting Worker

deleteWorkerButton.addEventListener('click', function (e) {
  deletedWorkerSpan.innerText = workersSelect.value;
});
deleteWorkerForm.addEventListener('submit', function (e) {
  e.preventDefault();
  jobRoom.deleteWorker();
  select.deleteWorker();
  jobUI.resetForm();
  $('#delete-worker-modal').modal('hide');
  setTimeout(selectFirstWorker, 500);
}); // Saving Data

jobUI.form.querySelector('.main-inputs').addEventListener('keyup', function () {
  jobRoom.saveJob(jobUI.getData());
});
jobUI.form.querySelector('.main-inputs').addEventListener('click', function () {
  jobRoom.saveJob(jobUI.getData());
});
newJobButton.addEventListener('click', function (e) {
  e.preventDefault();
  jobRoom.addJob();
  jobUI.resetForm();
  setTimeout(function () {
    document.querySelectorAll('textarea').forEach(function (textarea) {
      autoExpand(textarea);
    });
  }, 500);
});
resetButton.addEventListener('click', function (e) {
  e.preventDefault();
  jobUI.resetForm();
});
deleteJobButton.addEventListener('click', function (e) {
  e.preventDefault();
  jobRoom.deleteJob(function () {
    jobUI.resetForm();
  }).then(function () {
    jobRoom.getJob(function (data) {
      jobUI.fillForm(data);
    });
  });
}); // Updating the List

searchForm.addEventListener('submit', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(e) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            e.preventDefault();
            jobForm.classList.add('d-none');
            listGroup.classList.remove('d-none');
            Spinner.show();
            _context3.next = 6;
            return list.update(function (docs) {
              listUI.renderList(docs);
            }, searchForm.search.value.trim().toLowerCase(), searchForm['search-filter'].value.trim().toLowerCase());

          case 6:
            Spinner.hide();

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
listGroup.addEventListener('click', function (e) {
  if (e.target.classList.contains('data-link')) {
    jobRoom.getJob(function (data) {
      jobUI.fillForm(data);
    }, e.target.getAttribute('data-id'));
    listGroup.classList.add('d-none');
  } else if (e.target.tagName.toLowerCase() === 'button' && e.target.classList.contains('exit')) {
    e.preventDefault();
    list.deleteJob(e.target.parentElement.getAttribute('data-id'));
  } else if (e.target.tagName.toLowerCase() === 'span' && e.target.classList.contains('exit')) {
    e.preventDefault();
    list.deleteJob(e.target.parentElement.parentElement.getAttribute('data-id'));
  }
}); // Changing Tabs

document.querySelector('#archives-tab').addEventListener('click', function () {
  jobForm.classList.add('d-none');
  searchForm.classList.remove('d-none');
  listGroup.classList.remove('d-none');
  newJobButton.classList.add('d-none');
  recentJobInfo.classList.add('d-none');
});
document.querySelector('#recent-jobs-tab').addEventListener('click', function () {
  jobForm.classList.remove('d-none');
  searchForm.classList.add('d-none');
  newJobButton.classList.remove('d-none');
  recentJobInfo.classList.remove('d-none');
  refreshForm(workersSelect.value);
});
