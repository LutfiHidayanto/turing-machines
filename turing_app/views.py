from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect 
from django.urls import reverse
import math
from .turingCase0 import *

# Create your views here.

BASE_DIR = 'turing_app/'
MULTI_DIR = 'MultiTape/'
CASE_0_DIR = 'Case0/'

def case_0(request):
    if request.method == 'POST':
        m = request.POST.get('m')
        n = request.POST.get('n')
        a = request.POST.get('a')
        b = request.POST.get('b')

        data = {
            'm': m,
            'n': n,
            'a': a,
            'b': b,
        }
     
        tm = Turing(m, n, a, b)

        print(m, n, a, b)

        max_iterations = 1000  
        tape_a = []
        tape_b = []
        tape_c = []
        tape_final = []
        for tm.step in range(max_iterations):
            if tm.inFinState:
                break  
            tm.log()
            tape_a.append(tm.tapeA[:])  # Append a copy of tm.tapeA
            tape_b.append(tm.tapeB[:])  # Append a copy of tm.tapeB
            tape_c.append(tm.tapeDiv[:])  # Append a copy of tm.tapeDiv
            tape_final.append(tm.tapeLog[:])  # Append a copy of tm.tapeLog
        
        print(tape_final)
        tape_log = {
            'tape_a': tape_a,
            'tape_b': tape_b,
            'tape_c': tape_c,
            'tape_final': tape_final
        }

        # Reset head log dan current state
        tm.resetHead(10, "log")
        tm.reset(False, 0, 0)

        # Multiplication process
        tape_a = []
        tape_b = []
        tape_final = []
        for tm.step in range(max_iterations):
            if tm.inFinState:
                print("End Mul")
                break
            tm.multiplication()
            tape_a.append(tm.tapeM[:])  # Append a copy of tm.tapeM
            tape_b.append(tm.tapeLog[:])  # Append a copy of tm.tapeMul
            tape_final.append(tm.tapeMul[:])  # Append a copy of tm.tapeFin

        tape_mul = {
            'tape_a': tape_a,
            'tape_b': tape_b,
            'tape_final_mul': tape_final
        }

        # Reset head mul dan current state
        tm.resetHead(10, "mul")
        tm.reset(False, 0, 0)

        # Division process
        tape_a = []
        tape_b = []
        tape_final = []
        for tm.step in range(max_iterations):
            if tm.inFinState:
                print("End Div")
                break
            tm.division()
            tape_a.append(tm.tapeN[:])  # Append a copy of tm.tapeM
            tape_b.append(tm.tapeMul[:])  # Append a copy of tm.tapeLog
            tape_final.append(tm.tapeFin[:])  # Append a copy of tm.tapeMul

        tape_div = {
            'tape_a': tape_a,
            'tape_b': tape_b,
            'tape_final_div': tape_final
        }

        context = {
            'tape_log': tape_log,
            'tape_mul': tape_mul,
            'tape_div': tape_div,
        }

        return render(request, BASE_DIR + CASE_0_DIR + 'case0.html', context)

    return render(request, BASE_DIR + CASE_0_DIR + 'case0.html')

def index(request):
    return render(request, BASE_DIR + 'index.html')

def mt_addition(request):
    data = request.session.get('data', {})
    m = data['m']
    n = data['n']

    context = {
        'mn': m + n,
    }
    return render(request, BASE_DIR + MULTI_DIR + 'addition.html', context)

def mt_division(request):
    init_input = ""
    if request.method == 'POST':
        init_input = request.POST.get('final_output')
        ar = init_input.split(' ')
        init_input = ''.join(ar)

        data = request.session.get('data', {})
        add_sign = request.session.get('add_sign')
        a = data['a']
        even = False

        if len(a) % 2 == 0:
            even = True

        b = data['b'] + '1'
        if add_sign == '+':
            init_input = '+' + init_input
        elif add_sign == '-':
            if not even:
                init_input = '-' + init_input
            else:
                init_input = '+' + init_input


        init_input = init_input[:-1]
        init_input = init_input + b 


    context = {
        'init_input': init_input
    }
    print(init_input)
    return render(request, BASE_DIR + MULTI_DIR + 'division.html', context)

def mt_power(request):
    init_input = ""
    if request.method == 'POST':
        init_input = request.POST.get('final_output')
        ar = init_input.split(' ')
        init_input = ''.join(ar)

        data = request.session.get('data', {})
        request.session['add_sign'] = init_input[0]


        a = data['a'] + '1'
        print(f"a: {a}")

        init_input = init_input[1:]
        init_input = a + init_input


    context = {
        'init_input': init_input
    }
    print(init_input)

    return render(request, BASE_DIR + MULTI_DIR + 'power.html', context)

def X(request):
    if request.method == 'POST':
        m = request.POST.get('m')
        n = request.POST.get('n')
        a = request.POST.get('a')
        b = request.POST.get('b')

        data = {
            'm': m,
            'n': n,
            'a': a,
            'b': b,
        }

        request.session['data'] = data

        return HttpResponseRedirect(reverse('mt_addition'))
    return render(request, BASE_DIR + MULTI_DIR + 'X.html')

def mt_logarithm(request):
    return render(request, BASE_DIR + MULTI_DIR + 'BinaryLogarithm.html')

def log_base_change_to_2(number, base):
    log_number = math.log(number)
    log_base = math.log(base)
    new_log = log_number / log_base
    exponent = new_log / math.log(2)
    return round(exponent)