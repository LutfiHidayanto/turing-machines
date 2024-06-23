class Turing: 
    def __init__(self, m, n, a, b):
        self.state = {0,1,2,3,4,5,6}
        self.input_symbol = {'0', '1'}  # ∑ (simbol input yg dipakai di tape)
        self.tape_symbol = {'0', '1', 'X', 'B'}  # Γ (simbol tape, termasuk blank symbol 'B', 'X' nanti buat penanda)
        self.blank_symbol = 'B'
        self.current_state = 0  # State awal
        self.step = 0  # Hitung step
        self.inFinState = False
        
        # Posisi awal head
        self.head_m = 10
        self.head_n = 10
        self.head_a = 10
        self.head_b = 10
        self.head_div = 10
        self.head_log = 10
        self.head_mul = 10
        self.head_fin = 10 
        
        # Input values
        self.m = self.prepare_input(m)
        self.n = self.prepare_input(n)
        self.a = self.prepare_input(a)
        self.b = self.prepare_input(b)
        
        # Inisialisasi tape
        self.tapeM = self.m  # Tape m
        self.tapeN = self.n  # Tape n
        self.tapeA = self.a  # Tape a
        self.tapeB = self.b  # Tape b
        self.tapeDiv = [self.blank_symbol] * 30  # Tape hasil division log
        self.tapeLog = [self.blank_symbol] * 30  # Tape hasil log
        self.tapeMul = [self.blank_symbol] * 30  # Tape hasil multiple
        self.tapeFin = [self.blank_symbol] * 30  # Tape hasil akhir
         
    def prepare_input(self, input_str):
        # Nambahin blank symbol biar ada 'B' di kanan kiri input
        return [self.blank_symbol] * 10 + list(input_str) + [self.blank_symbol] * 10
    
    def reset(self, inFinState,  current_state, step):
        self.inFinState = inFinState
        self.current_state = current_state
        self.step = step
    def resetHead(self, headNew, calName):
        if calName == "log":
            self.head_log = headNew
        if calName == "mul":
            self.head_mul = headNew

    ## Fungsi mindahin/replace waktu tansisi (ubah simbol, head, state)
    def transitionLog(self, symReplace1, symReplace2, symReplace3, symReplace4, headMove1, headMove2, headMove3, headMove4, stateNew):
        # Pindah state
        self.current_state = stateNew
        self.step += 1
        
        # Transisi/ubah isi simbol tape
        self.tapeA[self.head_a] = symReplace1
        self.tapeB[self.head_b] = symReplace2
        self.tapeDiv[self.head_div] = symReplace3
        self.tapeLog[self.head_log] = symReplace4
        
        # Fungsi mindahin head
        if headMove1 == 'R': self.head_a += 1
        elif headMove1 == 'L': self.head_a -= 1
        if headMove2 == 'R': self.head_b += 1
        elif headMove2 == 'L': self.head_b -= 1
        if headMove3 == 'R': self.head_div += 1
        elif headMove3 == 'L': self.head_div -= 1
        if headMove4 == 'R': self.head_log += 1
        elif headMove4 == 'L': self.head_log -= 1
        
    def transitionMul(self, symReplace1, symReplace2, symReplace3, headMove1, headMove2, headMove3, stateNew):
        # Pindah state
        self.current_state = stateNew
        self.step += 1
        
        # Transisi/ubah isi simbol tape
        self.tapeM[self.head_m] = symReplace1
        self.tapeLog[self.head_log] = symReplace2
        self.tapeMul[self.head_mul] = symReplace3
        
        # Fungsi mindahin head
        if headMove1 == 'R': self.head_m += 1
        elif headMove1 == 'L': self.head_m -= 1
        if headMove2 == 'R': self.head_log += 1
        elif headMove2 == 'L': self.head_log -= 1
        if headMove3 == 'R': self.head_mul += 1
        elif headMove3 == 'L': self.head_mul -= 1
    
    def transitionDiv(self, symReplace1, symReplace2, symReplace3, headMove1, headMove2, headMove3, stateNew):
        # Pindah state
        self.current_state = stateNew
        self.step += 1
        
        # Transisi/ubah isi simbol tape
        self.tapeN[self.head_n] = symReplace1
        self.tapeMul[self.head_mul] = symReplace2
        self.tapeFin[self.head_fin] = symReplace3
        
        # Fungsi mindahin head
        if headMove1 == 'R': self.head_n += 1
        elif headMove1 == 'L': self.head_n -= 1
        if headMove2 == 'R': self.head_mul += 1
        elif headMove2 == 'L': self.head_mul -= 1
        if headMove3 == 'R': self.head_fin += 1
        elif headMove3 == 'L': self.head_fin -= 1
    
    ## Fungsi replace selesaiii
    ## Sekarang fungsi Transisi Turing Machine ()
    
    def log(self):
        match self.current_state:
            case 0:
                if self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='0' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('X', 'B', 'B', 'B', 'R', 'R', 'S', 'S', 0)
                elif self.tapeA[self.head_a]=='1' and self.tapeB[self.head_b]=='0' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('1', '0', 'B', 'B', 'L', 'S', 'S', 'S', 1)
                elif self.tapeA[self.head_a]=='1' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('1', '1', 'B', 'B', 'L', 'S', 'S', 'S', 1)
                elif self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '1', 'B', 'B', 'R', 'S', 'L', 'S', 2)
            case 1:
                if self.tapeA[self.head_a]=='X' and self.tapeB[self.head_b]=='0' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '0', 'B', 'B', 'L', 'S', 'S', 'S', 1)
                elif self.tapeA[self.head_a]=='X' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '1', 'B', 'B', 'L', 'S', 'S', 'S', 1)
                elif self.tapeA[self.head_a]=='B' and self.tapeB[self.head_b]=='0' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('B', '0', '0', 'B', 'R', 'S', 'R', 'S', 0)
                elif self.tapeA[self.head_a]=='B' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('B', '1', '0', 'B', 'R', 'S', 'R', 'S', 0)
            case 2:
                if self.tapeA[self.head_a]=='1' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='0' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('1', '1', '0', '0', 'L', 'S', 'S', 'R', 3)
                elif self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '1', 'B', '1', 'S', 'S', 'R', 'S', 4)
                elif self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='0' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '1', '0', '1', 'S', 'S', 'R', 'S', 4)
            case 3:
                if self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='1' and self.tapeDiv[self.head_div]=='0' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '1', '0', 'B', 'S', 'L', 'S', 'S', 5)
            case 4:
                self.inFinState = True
            case 5:
                if self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='0' and self.tapeDiv[self.head_div]=='0' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '0', 'B', 'B', 'S', 'L', 'L', 'S', 5)
                elif self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='B' and self.tapeDiv[self.head_div]=='0' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '0', 'B', 'B', 'S', 'L', 'L', 'S', 5)
                elif self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='B' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', 'B', 'B', 'B', 'S', 'L', 'S', 'S', 6)
            case 6:
                if self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='B' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', 'B', 'B', 'B', 'S', 'R', 'S', 'S', 6)
                elif self.tapeA[self.head_a]=='0' and self.tapeB[self.head_b]=='0' and self.tapeDiv[self.head_div]=='B' and self.tapeLog[self.head_log]=='B' :
                    self.transitionLog('0', '0', 'B', 'B', 'S', 'S', 'S', 'S', 0)                
    
    def multiplication(self):
        match self.current_state:
            case 0:
                if self.tapeM[self.head_m]=='0' and self.tapeLog[self.head_log]=='0' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('0', '0', '0', 'R', 'S', 'R', 0)
                elif self.tapeM[self.head_m]=='1' and self.tapeLog[self.head_log]=='0' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('1', '0', 'B', 'L', 'S', 'S', 1)
                elif self.tapeM[self.head_m]=='1' and self.tapeLog[self.head_log]=='1' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('1', '1', '1', 'S', 'S', 'S', 3)
                elif self.tapeM[self.head_m]=='0' and self.tapeLog[self.head_log]=='1' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('0', '1', '1', 'S', 'S', 'S', 3)
                else: self.inFinState = True
            case 1:
                if self.tapeM[self.head_m]=='0' and self.tapeLog[self.head_log]=='0' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('0', 'B', 'B', 'L', 'R', 'S', 2)
                elif self.tapeM[self.head_m]=='B' and self.tapeLog[self.head_log]=='0' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('B', '0', '1', 'S', 'S', 'S', 3)
                else: self.inFinState = True
            case 2:
                if self.tapeM[self.head_m]=='0' and self.tapeLog[self.head_log]=='0' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('0', '0', 'B', 'L', 'S', 'S', 2)
                elif self.tapeM[self.head_m]=='0' and self.tapeLog[self.head_log]=='1' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('0', '1', 'B', 'L', 'S', 'S', 2)
                elif self.tapeM[self.head_m]=='B' and self.tapeLog[self.head_log]=='0' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('B', '0', 'B', 'R', 'S', 'S', 0)
                elif self.tapeM[self.head_m]=='B' and self.tapeLog[self.head_log]=='1' and self.tapeMul[self.head_mul]=='B':
                    self.transitionMul('B', '1', 'B', 'R', 'S', 'S', 0)
                else: self.inFinState = True
            case 3:
                self.inFinState = True
    
    def division(self):
        match self.current_state:
            case 0:
                if self.tapeN[self.head_n]=='0' and self.tapeMul[self.head_mul]=='0' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('X', 'B', 'B', 'R', 'R', 'S', 1)
                elif self.tapeN[self.head_n]=='0' and self.tapeMul[self.head_mul]=='1' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('0', '1', '1', 'S', 'S', 'S', 3)
                elif self.tapeN[self.head_n]=='1' and self.tapeMul[self.head_mul]=='0' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('1', '0', '1', 'S', 'S', 'S', 3)
                elif self.tapeN[self.head_n]=='1' and self.tapeMul[self.head_mul]=='1' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('1', '1', '1', 'S', 'S', 'S', 3)
            case 1:
                if self.tapeN[self.head_n]=='0' and self.tapeMul[self.head_mul]=='0' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('X', 'B', 'B', 'R', 'R', 'S', 1)
                elif self.tapeN[self.head_n]=='1' and self.tapeMul[self.head_mul]=='0' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('1', '0', 'B', 'L', 'S', 'S', 2)
                elif self.tapeN[self.head_n]=='1' and self.tapeMul[self.head_mul]=='1' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('1', '1', 'B', 'L', 'S', 'S', 2)
            case 2:
                if self.tapeN[self.head_n]=='X' and self.tapeMul[self.head_mul]=='0' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('0', '0', 'B', 'L', 'S', 'S', 2)
                elif self.tapeN[self.head_n]=='X' and self.tapeMul[self.head_mul]=='1' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('0', '1', 'B', 'L', 'S', 'S', 2)
                elif self.tapeN[self.head_n]=='B' and self.tapeMul[self.head_mul]=='0' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('B', '0', '0', 'R', 'S', 'R', 0)
                elif self.tapeN[self.head_n]=='B' and self.tapeMul[self.head_mul]=='1' and self.tapeFin[self.head_fin]=='B':
                    self.transitionDiv('B', '1', '0', 'R', 'S', 'R', 0)
            case 3:
                self.inFinState = True
    
# Contoh penggunaan
tm = Turing("0001", "001", "001", "000001")

inFinState = tm.inFinState

# Coba log
max_iterations = 1000  # Set a maximum number of iterations to prevent infinite loops
for tm.step in range(max_iterations):
    if tm.inFinState:
        print("End Log")
        break  # Exit the loop if inFinState becomes True
    
    print("LOGARITMA")
    tm.log()
    print(tm.tapeA)
    print(tm.tapeB)  # Isi tape b
    print(tm.tapeDiv)
    print(tm.tapeLog)  # cek hasil turing log
    print("Step: ", tm.step)
    print("State: q", tm.current_state)
    print(tm.head_a)
    print(tm.tapeA[tm.head_a])
    print(tm.head_b)
    print(tm.tapeB[tm.head_b])
    print(tm.head_div)
    print(tm.tapeDiv[tm.head_div])
    print(tm.head_log)
    print(tm.tapeLog[tm.head_log])
    print(tm.inFinState)
    print("\n")
    print("LOGARITMA END")

if not tm.inFinState:
    print("Max iterations reached. Possible infinite loop.")
    
# Reset head log dan current state
tm.resetHead(10, "log")
tm.reset(False, 0, 0)

# Coba Multiplication
max_iterations = 1000  # Set a maximum number of iterations to prevent infinite loops
for tm.step in range(max_iterations):
    if tm.inFinState:
        print("End Mul")
        break  # Exit the loop if inFinState becomes True
    
    tm.multiplication()
    print(tm.tapeM)
    print(tm.tapeLog)  
    print(tm.tapeMul)
    print("Step: ", tm.step)
    print("State: q", tm.current_state)
    print(tm.head_m)
    print(tm.tapeM[tm.head_m])
    print(tm.head_log)
    print(tm.tapeLog[tm.head_log])  
    print(tm.head_mul)
    print(tm.tapeMul[tm.head_mul])
    print(tm.inFinState)
    print("\n")
if not tm.inFinState:
    print("Max iterations reached. Possible infinite loop.")


# Reset head mul dan current state
tm.resetHead(10, "mul")
tm.reset(False, 0, 0)

# Coba Div
max_iterations = 1000  # Set a maximum number of iterations to prevent infinite loops
for tm.step in range(max_iterations):
    if tm.inFinState:
        print("End Div")
        break  # Exit the loop if inFinState becomes True
    
    tm.division()
    print(tm.tapeN)
    print(tm.tapeMul)
    print(tm.tapeFin)  
    print("Step: ", tm.step)
    print("State: q", tm.current_state)
    print(tm.head_n)
    print(tm.tapeN[tm.head_n])
    print(tm.head_mul)
    print(tm.tapeMul[tm.head_mul])
    print(tm.head_fin)
    print(tm.tapeFin[tm.head_fin])  
    print(tm.inFinState)
    print("\n")
if not tm.inFinState:
    print("Max iterations reached. Possible infinite loop.")

# print(tm.inFinState)
# print("Step: ", tm.step)
# print("State: q", tm.current_state)
# print(tm.tapeM[10])
# print(tm.tapeLog[10])  
# print(tm.tapeMul[10])
# print("Tahap Multiple m x hasil-log")

# Untuk melihat isi tape
# print(tm.tapeM)  # Isi tape m
# print(tm.tapeN)  # Isi tape n
# print("\n")
# print(tm.tapeA)  # Isi tape a
# print(tm.tapeB)  # Isi tape b
# print(tm.tapeDiv)
# print(tm.tapeLog)  # cek hasil turing log
# print(tm.tapeMul)
# print(tm.tapeFin)